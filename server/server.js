
import dotenv from "dotenv";
dotenv.config();
import express from  "express";
import { createServer } from "node:http";
import cors from "cors";
import {Server} from "socket.io";
import mongoose from "mongoose";
import { connect } from "node:http2";
import {connectToServer} from "./controllers/socketManager.js";
import userRoutes from "./routes/users.routes.js";



const PORT = process.env.PORT || 8080;
const app = express();
app.use(cors({
  origin: "http://localhost:5173",

}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true,}));


const server= createServer(app);
const io=connectToServer(server);
app.use("/",userRoutes);
app.get("/", (req, res) => {
    res.send("VMeet Server is running 🚀");
});

app.get("/home",(req,res)=>{
    res.send("VMeet home page!!");
})


const start= async()=>{
   try{
       const connection = await mongoose.connect(process.env.MONGO_URI);
   console.log("MongoDB connected successfully");
   server.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
   }
)
   }
   catch(err){
    console.error("Error starting server:", err);

   }
 
};


start();