import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
});

export default envSchema.parse(process.env);
