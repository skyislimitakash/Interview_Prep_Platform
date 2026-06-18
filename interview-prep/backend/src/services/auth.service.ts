import jwt from "jsonwebtoken";
import { User } from "../models";
import { env } from "../config/env";
import { RegisterDto, LoginDto, AuthResponseData, JwtPayload } from "../types";

const signToken = (user: User): string => {
  const payload: JwtPayload = { id: user.id, email: user.email, role: user.role };
  return jwt.sign(payload, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn as jwt.SignOptions["expiresIn"],
  });
};

export const registerUser = async (dto: RegisterDto): Promise<AuthResponseData> => {
  const existing = await User.findOne({ where: { email: dto.email } });
  if (existing) throw new Error("A user with this email already exists.");

  // passwordHash field is used as the plain password here;
  // the beforeCreate hook in User model will bcrypt it automatically.
  const user = await User.create({
    name: dto.name,
    email: dto.email,
    passwordHash: dto.password,
  });

  return { token: signToken(user), user: user.toSafeJSON() as AuthResponseData["user"] };
};

export const loginUser = async (dto: LoginDto): Promise<AuthResponseData> => {
  const user = await User.findOne({ where: { email: dto.email } });
  if (!user || !user.isActive) throw new Error("Invalid email or password.");

  const valid = await user.comparePassword(dto.password);
  if (!valid) throw new Error("Invalid email or password.");

  return { token: signToken(user), user: user.toSafeJSON() as AuthResponseData["user"] };
};

export const getMe = async (userId: number) => {
  const user = await User.findByPk(userId);
  if (!user) throw new Error("User not found.");
  return user.toSafeJSON();
};
