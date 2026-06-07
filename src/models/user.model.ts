import { HydratedDocument, InferSchemaType, Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String, 
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    
    password: { type: String, required: false, select: false },

    otp: { type: String },

    otpExpiry: { type: Date },

    role: { type: String, enum: ["user", "admin"], default: "user" },

    isActive: { type: Boolean, default: true },
    tokens: [
      {
        token: { type: String, required: true },
        isActive: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export type User = InferSchemaType<typeof userSchema>;
export type UserDocument = HydratedDocument<User>;

export const UserModel = model("User", userSchema);