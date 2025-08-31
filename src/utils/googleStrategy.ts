import passport from "passport";
import { Strategy as GoogleStrategy, Profile, StrategyOptions } from "passport-google-oauth20";
import dotenv from "dotenv";
import User, { IUser } from "../models/User";

dotenv.config();

const options: StrategyOptions = {
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`, // ✅ full URL
  passReqToCallback: false,
};


passport.use(
  new GoogleStrategy(
    options,
    async (_accessToken, _refreshToken, profile: Profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email returned from Google"), undefined);
        }

        let user = await User.findOne({ email });

        if (!user) {
          // create new Google user
          user = await User.create({
            email,
            name: profile.displayName,
            password: null,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || null,
          } as Partial<IUser>);
        } else if (!user.googleId) {
          // link existing user with GoogleId
          user.googleId = profile.id;
          user.avatar = profile.photos?.[0]?.value || user.avatar;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, undefined);
      }
    }
  )
);

export default passport;
