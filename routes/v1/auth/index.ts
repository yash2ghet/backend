import { Router } from "express";
import { z } from "zod";

const authRouter = Router();

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

authRouter.post("/login", (req, res) => {

    const body = req.body;
    console.log("Login request body:", body);
    const result = loginSchema.safeParse(body);

    if (!result.success) {
        return res.status(400).json({
            message: "Invalid request",
            errors: result.error.message

        });
    }

    res.status(200).json({ message: "Login successful" });
})

export default authRouter;