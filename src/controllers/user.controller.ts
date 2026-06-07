import type { Request, Response } from 'express';
import * as userService from '@/services/user.service';
import { sendSuccess } from '@/helpers/apiResponse';
import type { CreateUserInput, UpdateUserInput } from '@/validations/user.validation';

export async function listUsers(req: Request, res: Response): Promise<void> {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 20);
  const result = await userService.listUsers(page, limit);
  sendSuccess(res, 200, result, 'Users retrieved');
}

export async function getUser(req: Request<{ id: string }>, res: Response): Promise<void> {
  const user = await userService.getUserById(req.params.id);
  sendSuccess(res, 200, user, 'User retrieved');
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const user = await userService.createUser(req.body as CreateUserInput);
  sendSuccess(res, 201, user, 'User created');
}

export async function updateUser(req: Request<{ id: string }>, res: Response): Promise<void> {
  const user = await userService.updateUser(req.params.id, req.body as UpdateUserInput);
  sendSuccess(res, 200, user, 'User updated');
}

export async function deleteUser(req: Request<{ id: string }>, res: Response): Promise<void> {
  await userService.deleteUser(req.params.id);
  sendSuccess(res, 200, null, 'User deleted');
}