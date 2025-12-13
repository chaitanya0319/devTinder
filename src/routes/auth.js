const express= require("express");
const authRouter=express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");          // 👈 ADD THIS
const JWT_SECRET = "Dev@Tinder$790"; 

authRouter.post("/signup", async (req, res) => {
    try {
      // 1. Validate input
      validateSignUpData(req.body);
  
      // 2. Hash password
      const passwordHash = await bcrypt.hash(req.body.password, 10);
  
      // 3. Create user with hashed password
      const user = new User({
        ...req.body,
        password: passwordHash,
      });
  
      // 4. Save to DB
    const savedUser = await user.save();
    const token = await savedUser.getJWT();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });

    res.json({ message: "User Added successfully!", data: savedUser });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  });

  authRouter.post("/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
  
      // 1. Find user by email
      const user = await User.findOne({ emailId: emailId });
  
      if (!user) {
        throw new Error("Invalid Credentails");
      }
  
      // 2. Compare password
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        throw new Error("Invalid Credentails");
      }
  
      // 3. Create JWT token and set cookie
      const token = jwt.sign({ _id: user._id }, JWT_SECRET);
      res.cookie("token", token);
  
      // 4. Success
      res.send(user);
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  });

  authRouter.post("/logout",async (req,res)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
    });
    res.send("Logout successful")
  })

  module.exports=authRouter;