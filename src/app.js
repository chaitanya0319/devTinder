const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth}= require("./middlewares/auth");
const userRouter= require("./routes/user");
const cors = require("cors");
const app = express();
const JWT_SECRET = "Dev@Tinder$790"; // keep ONE common secret

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());



// app.post("/signup", async (req, res) => {
//     try {
//         validateSignUpData(req);
//         const user =new User(req.body);
//         await user.save();
//         res.send("User added sucessfully!");
//     }catch(err){
//         res.status(400).send("ERROR:"+err.message);
//     }
// });
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
    const user = req.user;
    // Sending a connection request
    console.log("Sending a connection request");
    res.send(user.firstName + "sent the connect request!");
});



// ✅ FEED – get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});


// ✅ DB connect + start server
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected", err);
  });
