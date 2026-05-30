import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { UserModel } from "../models/user.model";

import jwt from "jsonwebtoken";

import {
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validations/auth.validation";

import transporter from "../config/mailer";
import { email } from "zod";
import authRouter from "../routes/v1/auth";
import { authMiddleware } from "../middlewares/auth.middleware";

// 1.
export const login = async (req: Request, res: Response) => {
  const body = req.body;

  const result = loginSchema.safeParse(body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid request",
      errors: result.error.message,
    });
  }

  const checkEmailAndPasswordFromMongo = await UserModel.findOne({
    email: result.data.email,
  }).select("+password");

  if (!checkEmailAndPasswordFromMongo?.password) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const comparePassword = await bcrypt.compare(
    result.data.password,
    checkEmailAndPasswordFromMongo.password,
  );

  if (!comparePassword) {
    return res.status(401).json({
      message: "Invalid password",
    });
  }

  const payload = {
    userId: checkEmailAndPasswordFromMongo._id,
    firstName: checkEmailAndPasswordFromMongo.firstName,
    lastName: checkEmailAndPasswordFromMongo.lastName,
    email: checkEmailAndPasswordFromMongo.email,
    role: checkEmailAndPasswordFromMongo.role,
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "JWT secret is not defined" });
  }
  const expiresIn = (process.env.JWT_EXPIRES_IN as any) || "7d";
  const token = jwt.sign(payload, secret, {
    expiresIn,
  })

  checkEmailAndPasswordFromMongo.tokens.push({ token, isActive: true });
  await checkEmailAndPasswordFromMongo.save();

  res.status(200).json({
    message: "Login successful",
    token,
  });
};

// 2.
export const signup = async (req: Request, res: Response) => {
  const body = req.body;

  const result = signupSchema.safeParse(body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid request",
      errors: result.error.message,
    });
  }

  const existingUser = await UserModel.findOne({
    email: result.data.email,
  });

  if (existingUser) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(
    result.data.password,
    10
  );

  await UserModel.create({
    // name: result.data.fullName,
    firstName: result.data.firstName,
    lastName: result.data.lastName,
    email: result.data.email,
    password: hashedPassword,
  });

  res.status(201).json({
    message: "Signup successful",
  });
};

// 3.
export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  const body = req.body;

  const result = forgotPasswordSchema.safeParse(body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid request",
      errors: result.error.message,
    });
  }

  const existingUser = await UserModel.findOne({
    email: result.data.email,
  });

  if (!existingUser) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const otp = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: result.data.email,
    subject: "Password Reset OTP",
    text: `Your OTP is ${otp}`,
    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h2>Password Reset Request</h2>

        <p>Your OTP for password reset is:</p>

        <h1 style="color: blue; letter-spacing: 5px;">
          ${otp}
        </h1>

        <p>This OTP will expire in 5 minutes.</p>
      </div>
    `,
  });

  existingUser.otp = otp;

  existingUser.otpExpiry = new Date(
    Date.now() + 5 * 60 * 1000
  );

  await existingUser.save();

  res.status(200).json({
    message: "Reset link sent successfully",
    email: result.data.email,
  });
};

// 4.
export const verifyOtp = async (
  req: Request,
  res: Response
) => {
  const { email, otp } = req.body;

  const user = await UserModel.findOne({ email });

  console.log("Entered OTP:", otp);

  console.log("Saved OTP:", user?.otp);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (user.otp !== otp) {
    return res.status(400).json({
      message: "Invalid OTP",
    });
  }

  if (!user.otpExpiry || user.otpExpiry < new Date()) {
    return res.status(400).json({
      message: "OTP expired",
    });
  }

  res.json({
    message: "OTP verified successfully",
  });
};

// 5.
export const resetPassword = async (
  req: Request,
  res: Response
) => {
  const body = req.body;

  const result = resetPasswordSchema.safeParse(body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid request",
      errors: result.error.message,
    });
  }

  const user = await UserModel.findOne({
    email: result.data.email,
  });

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const hashedPassword = await bcrypt.hash(
    result.data.password,
    10
  );

  user.password = hashedPassword;

  user.otp = undefined;

  user.otpExpiry = undefined;

  await user.save();

  res.status(200).json({
    message: "Password updated successfully",
  });
};

// 6.
export const logout = async (req: any, res: Response) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    const user = await UserModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const tokenDoc = user.tokens.find((t: any) => t.token === token);

    if (tokenDoc) {
      tokenDoc.isActive = false;
    }

    await user.save();

    res.status(200).json({
      message: "Logout successful",
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};
