import jwt from "jsonwebtoken";
import env from "../config/env.js";

interface User {
  username: string;
  id: string;
}

const generateAccessToken = ({ username, id }: User) => {
  return jwt.sign({ id: id, username: username }, env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = ({ username, id }: User) => {
  return jwt.sign({ username, id }, env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const verifyToken = (
  token: string,
  type: "access" | "refresh",
  onSuccessCallback: (user: User) => void,
  onErrorCallback: () => void
) => {
  const secret =
    type === "access" ? env.ACCESS_TOKEN_SECRET : env.REFRESH_TOKEN_SECRET;
  jwt.verify(token, secret, (err, user) => {
    if (err) {
      onErrorCallback();
      return;
    }
    onSuccessCallback(user as User);
  });
};

export { generateAccessToken, generateRefreshToken, verifyToken };
