import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  NODE_ENV: "development" | "production";
  JWT_SECRET: string;
  JWT_ACCESS_EXPIRY: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRY: string;
}
const loadEnvVariable = (): EnvConfig => {
  const requireEnvVariables: string[] = [
    "PORT",
    "NODE_ENV",
    "JWT_SECRET",
    "JWT_ACCESS_EXPIRY",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRY",
  ];
  requireEnvVariables.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Missing require enviroment variable ${key} `);
    }
  });

  return {
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as "development" | "production",
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_EXPIRY as string,
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY as string,
  };
};
export const envVariable = loadEnvVariable();
