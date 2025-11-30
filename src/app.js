const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const app = express();
const JWT_SECRET = "Dev@Tinder$790"; // keep ONE common secret

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

app.post("/signup", async (req, res) => {
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
    await user.save();

    // 5. Create JWT token and set cookie
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    res.cookie("token", token);

    res.send("User added successfully!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      throw new Error("Invalid Token");
    }

    // verify token
    const decodedMessage = jwt.verify(token, JWT_SECRET);
    const { _id } = decodedMessage;

    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User does not exist");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
});

app.post("/login", async (req, res) => {
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
    res.send("Login successful");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// ✅ GET USER BY EMAIL (using query param instead of body)
app.get("/user", async (req, res) => {
  const userEmail = req.query.emailId; // /user?emailId=test@gmail.com

  if (!userEmail) {
    return res.status(400).send("emailId is required");
  }

  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
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

// ✅ DELETE USER BY ID (use URL param)
app.delete("/user/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.send("User is deleted successfully");
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
});

// ✅ UPDATE USER BY ID (partial update)
app.patch("/user/:id", async (req, res) => {
  const userId = req.params.id;
  const data = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, data, {
      new: true,          // return updated doc
      runValidators: true // apply schema validation
    });

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
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
