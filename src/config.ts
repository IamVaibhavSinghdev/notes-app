import dotenv from "dotenv";

dotenv.config();

export const config = {
port: Number(process.env.PORT || 4000),
mongoUri : process.env.MONGO_URI as string,
jwtSecret : process.env.JWT_SECRET as string,
env : process.env.NODE_ENV || "development",
otpExpiryMin : Number(process.env.OTP_EXP_MIN) || 5
};

if (!config.mongoUri || !config.jwtSecret ) {
    throw new Error("NO MONGO_URI OR JWT_SECRET IN .env")
}