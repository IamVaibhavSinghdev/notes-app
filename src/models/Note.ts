import { Schema, model, Types } from "mongoose";

const noteSchema = new Schema({

    userId : { type : Types.ObjectId, ref: "User", required: true, index: true},
    title : {type : String, required : true},
    content: {type : String, default : ""}
},
{timestamps : true}
);

export default model("notes", noteSchema);