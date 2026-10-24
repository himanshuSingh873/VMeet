import { Schema } from "mongoose";
import mongoose from "mongoose";
 const  meetingSchema = new Schema({
    meetingId:{
        type: String,
        required: true,
        unique: true,
    },
    meetingCode:{
        type: String,
        required: true,
        unique: true,
    },
    user_id:{
        type: String,
        required: true,
    },
    meetingDate:{
        type: Date,
            default: Date.now
        
        },

})
const Meeting = mongoose.model("Meeting", meetingSchema);

export default Meeting;