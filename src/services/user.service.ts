import { UserModel } from '@/models/user.model';
import type { UserDocument } from '@/models/user.model';
import { hashPassword } from '@/helpers/password';
import { getPagination } from '@/helpers/pagination';
import { AppError } from '@/lib/AppError';

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

interface UpdateUserData {
  name?: string;
  email?: string;
  role?: 'user' | 'admin';
}

interface UserList {
  items: UserDocument[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export async function listUsers(pageInput: number, limitInput: number): Promise<UserList> {
  const { page, limit, skip } = getPagination(pageInput, limitInput);
  const [items, total] = await Promise.all([
    UserModel.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
    UserModel.countDocuments(),
  ]);
  return { items, total, page, limit, pages: Math.max(1, Math.ceil(total / limit)) };
}

export async function getUserById(id: string): Promise<UserDocument> {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return user;
}

export async function createUser(data: CreateUserData): Promise<UserDocument> {
  const existing = await UserModel.findOne({ email: data.email });
  if (existing) {
    throw new AppError(409, 'Email already registered');
  }
  const password = await hashPassword(data.password);
  return UserModel.create({ ...data, password });
}

export async function updateUser(id: string, data: UpdateUserData): Promise<UserDocument> {
  if (data.email) {
    const clash = await UserModel.findOne({ email: data.email, _id: { $ne: id } });
    if (clash) {
      throw new AppError(409, 'Email already in use');
    }
  }

  const user = await UserModel.findByIdAndUpdate(id, data, {
    returnDocument: 'after',
    runValidators: true,
  });
  if (!user) {
    throw new AppError(404, 'User not found');
  }
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  const user = await UserModel.findByIdAndDelete(id);
  if (!user) {
    throw new AppError(404, 'User not found');
  }
}