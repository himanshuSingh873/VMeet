import bcrypt from "bcrypt";
import crypto from "crypto";
import User from "../models/user.model.js";
import Meeting from "../models/meeting.model.js";
const userLogin= async(req,res)=>{
    const {username,password}=req.body;
    if(!username || !password){
        return res.status(400).json({message:"Please provide username and password"});
    }
    try{
        const existingUser= await User.findOne({username});
        if(!existingUser){
            return res.status(404).json({message:"User not found"});
        }
        const isMatch= await bcrypt.compare(password,existingUser.password);
         if(isMatch){
            let token= crypto.randomBytes(16).toString("hex");
            existingUser.token=token;
            await existingUser.save();
           return res.status(200).json({message:"Login successful",token:token});
         }

        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }


    }catch(err){
        res.status(500).json({message:"Internal server error"});
    }
}

const userRegister= async(req,res)=>{
        console.log(req.body);
    const {name,username,password}=req.body;
    console.log(req.body);
    try{
      const existingUser= await User.findOne({username});
      if(existingUser){
        return res.status(400).json({message:"User already exists"});
      }
      const hashedPassword= await bcrypt.hash(password,10);
      const newUser= new User({name:name,username:username,password:hashedPassword});
      await newUser.save();
      res.status(201).json({message:"User registered successfully"});
    }catch(err){
        res.status(500).json({message:"Internal server error"});
        console.log(err);
    }

}
const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
        const meetings = await Meeting.find({ user_id: user.username })
        res.json(meetings)
    } catch (e) {
        res.json({ message: `Something went wrong ${e}` })
    }
}


const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token });

        if (!user) {
            return res.status(401).json({
                message: "Invalid token"
            });
        }

        const newMeeting = new Meeting({
            meetingId: crypto.randomUUID(),
            meetingCode: meeting_code,
            user_id: user.username
        });

        await newMeeting.save();

        return res.status(201).json({
            message: "Added code to history"
        });
    } catch (e) {
        console.error("History save error:", e);

        return res.status(500).json({
            message: "Failed to save meeting history"
        });
    }
};



export {userLogin,userRegister,getUserHistory,addToHistory};