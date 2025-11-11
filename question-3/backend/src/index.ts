import "dotenv/config";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cookieParser from "cookie-parser";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "./utils/jwt.js";
import type { User } from "./types.js";
import { sanitizePassword, sanitizeUsername } from "./utils/sanitize.js";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

const SALTED_ROUND = 10;

// temporary store in memory
const users: User[] = [];

// Authentication Middleware
const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies["access-token"];

  if (!accessToken) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const onSuccessVerify = ({
    username,
    id,
  }: {
    username: string;
    id: string;
  }) => {
    (req as any).user = { username, id };
    next();
  };

  const onErrorVerify = () => {
    return res.status(401).json({ message: "Invalid token" });
  };

  verifyToken(accessToken, "access", onSuccessVerify, onErrorVerify);
};

// Routes
app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username && !password)
    return res.status(422).json({ message: "Empty data" });
  const isUserExist = users.some((user) => user.username === username);
  if (isUserExist)
    return res.status(409).json({ message: "user already exist" });
  const { isError } = sanitizeUsername(username);
  const { isError: isErrorPassword } = sanitizePassword(password);
  if (isError && isErrorPassword)
    return res.status(422).json({ message: "Error when sanitizing data" });

  const hashedPassword = await bcrypt.hash(password, SALTED_ROUND);

  const id = uuidv4();
  const data: User = {
    id,
    username,
    password: hashedPassword,
  };
  users.push(data);

  return res.status(201).json({ message: "Success" });
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username && !password)
    return res.status(401).json({ message: "Wrong password or username" });

  const index = users.findIndex((user) => user.username === username);
  const userData = users[index];

  const isAuthenticated = async () => {
    if (index === -1) return false;
    const isPasswordVerified = await bcrypt.compare(
      password,
      userData?.password!
    );
    return userData?.username === username && isPasswordVerified;
  };

  if (!(await isAuthenticated()))
    return res.status(401).json({ message: "Wrong password or username" });

  const accessToken = generateAccessToken({ username, id: userData?.id! });
  const refreshToken = generateRefreshToken({ username, id: userData?.id! });

  res.cookie("access-token", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refresh-token", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(200).json({
    message: "success",
    data: {
      accessToken,
      username,
      id: userData?.id,
    },
  });
});

app.post("/refresh", (req: Request, res: Response) => {
  const refreshToken = req.cookies["refresh-token"];
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token not found" });

  const onSuccessVerify = ({
    username,
    id,
  }: {
    username: string;
    id: string;
  }) => {
    const accessToken = generateAccessToken({
      username,
      id,
    });
    res.cookie("access-token", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    return res.status(200).json({
      message: "Success",
      data: {
        accessToken,
      },
    });
  };

  const onFailedVerify = () => {
    return res.status(401).json({ message: "Failed to verify refresh token" });
  };

  verifyToken(refreshToken, "refresh", onSuccessVerify, onFailedVerify);
});

app.get("/me", authMiddleware, (req: Request, res: Response) => {
  const { username, id } = (req as any).user;
  return res.status(200).json({ id, username });
});

app.post("/logout", authMiddleware, (_, res: Response) => {
  res.clearCookie("access-token", { path: "/" });
  res.clearCookie("refresh-token", { path: "/" });
  res.json({ message: "Logged out successfully" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
