import React, { createContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import httpStatus from "http-status";

export const AuthContext = createContext({});

const client = axios.create({
  baseURL: "http://localhost:8080",

});

export const AuthProvider = ({ children }) => {

  const [userData, setUserData] = useState(null);

  const router = useNavigate();

  const handleRegister = async (name, userName, password) => {
    try {
      let request = await client.post("/register", {
        name: name,
        username: userName,
        password: password,
      });

      if (request.status === httpStatus.CREATED) {
        return request.data.message;
      }
      return request.data;
    } catch (err) {
      throw err;
    }
  };

  const handleLogin = async (username, password) => {
    try {
      let request = await client.post("/login", {
        username: username,
        password: password,
      });

      if (request.status === httpStatus.OK) {
        localStorage.setItem("token", request.data.token);
        router("/home");
      }
    } catch (err) {
      throw err;
    }
  };
  const getUserHistory = async () => {
    try {
      let request = await client.get("/get_all_activity",{
        params:{
          token:localStorage.getItem("token")
        }
      });
      return request.data;
    } catch (err) {
      throw err;
    }
  };

  const addToHistory= async(meetingCode)=>{
      try{
        let req=await client.post("/add_all_activity",{
          token:localStorage.getItem("token"),
          meeting_code:meetingCode
        });
        return req;
      }catch(e){
        throw e;
      }
  };

  const Data = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getUserHistory,
    addToHistory
  };

  return (
    <AuthContext.Provider value={Data}>
      {children}
    </AuthContext.Provider>
  );
};