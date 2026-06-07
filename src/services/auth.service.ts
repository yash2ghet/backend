import { UserModel } from '../models/user.model';
import type { UserDocument } from '../models/user.model';
import { hashPassword, comparePassword } from '../helpers/password';
import { signToken } from '../lib/jwt';
import { AppError } from '../lib/AppError';
import type { RegisterInput, LoginInput } from '../validations/auth.validation';

interface AuthResult {
  user: UserDocument;
  token: string;
}

export async function registerUser(input: RegisterInput): Promise<AuthResult> {
  const existing = await UserModel.findOne({ email: input.email });
  if (existing) {
    throw new AppError(409, 'Email already registered');
  }

  const password = await hashPassword(input.password);
  const user = await UserModel.create({
    firstName: input.firstName,
    email: input.email,
    password,
  });

  const token = signToken({ sub: String(user._id), email: user.email, role: user.role });
  return { user, token };
}

export async function loginUser(input: LoginInput): Promise<AuthResult> {
  console.log(input);
  const user = await UserModel.findOne({
    email: input.email,
  }).select("+password");

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  if (!user.password) {
    throw new AppError(401, "Invalid email or password");
  }

  const matches = await comparePassword(
    input.password,
    user.password
  );

  if (!matches) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = signToken({ sub: String(user._id), email: user.email, role: user.role });
  return { user, token };
}