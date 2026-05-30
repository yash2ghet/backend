import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model";

export const authMiddleware = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        return res.status(500).json({ message: "JWT secret is not defined" });
    }

    try {
        const decoded = jwt.verify(token, secret);

        const checkUser = await UserModel.findOne({
            _id: (decoded as any).userId,
            "tokens.token": token,
            "tokens.isActive": true,
        });

        if (!checkUser) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};