import { Schema, model} from "mongoose";

const userSchema = new Schema({

    name: {type : String, required : true},
    email:{type : String, required : true},
    dob: {type : Date, required : false},
},
{ timestamps : true} 
);

export type IUser = {
    name: string;
    email: string;
    dob?: Date;
}

export default model ("User", userSchema);