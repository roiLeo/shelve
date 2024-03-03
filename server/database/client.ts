import { withAccelerate } from '@prisma/extension-accelerate'
import { PrismaClient } from "@prisma/client";
import { publicUser, Role, User } from "~/types/User";

const prisma = new PrismaClient().$extends(withAccelerate())

export default prisma;

export function formatUser(user: User): publicUser {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role as Role,
    avatar: user.avatar,
    authToken: user.authToken || "",
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
