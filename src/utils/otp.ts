import bcrypt from "bcryptjs";
import { config } from "../config";


export function generateOtp() : string {

    return Math.floor(100000 + Math.random() * 900000).toString();
}


export async function hashOtp ( otp : string) {

 const salt = await bcrypt.genSalt(10);
 return bcrypt.hash(otp, salt);

}

export function otpExpiryDate() {
const d = new Date();

d.setMinutes(d.getMinutes() + config.otpExpiryMin);
return d;

}

export async function compareOtp( plain : string, hash : string){

return bcrypt.compare(plain, hash);

}