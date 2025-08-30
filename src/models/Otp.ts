import { Schema, model} from "mongoose";

const otpSchema = new Schema (
    {
        email:{ type: String, required : true},
        purpose: { type : String, enum : ["signup", "login"], required : true},
        codeHash:{ type: String, required: true},
        expiresAt:{ type : Date, required: true} 
    },
    {timestamps : true}
    
);
export default model ("Otp", otpSchema);