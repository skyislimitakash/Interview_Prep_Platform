import dotenv from "dotenv";

dotenv.config();

const requiredVars = [
  "DB_HOST",
  "DB_NAME",
  "DB_USER",
  "DB_PASSWORD",
  "JWT_SECRET",
  "OPENAI_API_KEY",
];

requiredVars.forEach((key) => {
  if (!process.env[key]) {
    console.error(`[ENV] Missing required environment variable: ${key}`);
    process.exit(1);
  }
});

export const env = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV !== "production",

  db: {
    host: process.env.DB_HOST as string,
    port: parseInt(process.env.DB_PORT || "3306", 10),
    name: process.env.DB_NAME as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
  },

  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },

  openai: {
    apiKey: process.env.OPENAI_API_KEY as string,
    model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
  },

  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};
