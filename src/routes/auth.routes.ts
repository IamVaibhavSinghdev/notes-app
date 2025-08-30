import { Router } from "express";
import Otp from "../models/Otp";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { generateOtp, hashOtp, otpExpiryDate, compareOtp } from "../utils/otp";


const router = Router();

// post request for login 

router.post( "/request-otp", async ( req, res, next) => {
try {
    const { email, name, dob, purpose } = req.body as 
    {
        email: string;
        name ?: string;
        dob ?: string ;
        purpose : "signup" | "login";

    }; 
    if(!email || !purpose){

        return res.status(400).json (
            {
                error : "email or purpose is required"
            });
    }

    if( purpose === "login"){
        const exists = await User.findOne ( { email});

        if (!exists){
            return res.status(404).json (
                {
                    error : "No account with the following email found"
                }
            );
        }
        }

        const otp = generateOtp();

        const codeHash = await hashOtp(otp);

    await Otp.deleteMany( { email, purpose});
        
    await Otp.create( { email, codeHash, purpose , expiresAt : otpExpiryDate() } );

//for dev purpose only as we cant send real otps during testing so for that 

     const devHint = config.env === "development" ? { dev_otp: otp } : {};
    return res.json({ message: "OTP sent", expiresInMin: config.otpExpiryMin, ...devHint, name, dob });
  } catch (e) { next(e); }
});



// post request for signup 

router.post("/verify-otp", async (req, res, next) => {

  try {

    const { email, purpose, otp, name, dob } = req.body as {

      email: string;
       purpose: "signup" | "login";
        otp: string; 
        name?: string; 
        dob?: string;

    };


    if (!email || !purpose || !otp) {
        return res.status(400).json({ error: "Missing fields" });
    }

    const rec = await Otp.findOne({ email, purpose }).sort({ createdAt: -1 });

    if (!rec || rec.expiresAt < new Date()) {
        return res.status(400).json(
            { 
                error: "OTP expired or invalid" 
            });
    }

    const ok = await compareOtp(otp, rec.codeHash);


    if (!ok) return res.status(400).json({ 
        error: "Incorrect OTP" 
    });


    let user = await User.findOne({ email });


    if (purpose === "signup") {
        if (!user) {

            user = await User.create({
                email,
                name: name || email.split("@")[0],
                dob: dob ? new Date(dob) : undefined
        });
      }

    } 
    else {
        if (!user) return res.status(404).json({ 
            error: "Account not found" 
        });
    }

    await Otp.deleteMany({ email, purpose }); // to delete old otps 


    const token = jwt.sign({ 
        id: user!.id, 
        email: user!.email, 
        name: user!.name 
    }, 
    config.jwtSecret, { expiresIn: "7d" });

    return res.json({ token, user: 
        {
             id: user!.id, 
            email: user!.email, 
            name: user!.name,
            dob: user!.dob 
        } 
    });
  } catch (e) { next(e); }
});

export default router;