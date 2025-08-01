const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validate");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (err) {
    console.log("Error while fetching all users", err);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: req.body.emailId });
    if (!user) {
      res.status(404).send("User not found");
    }
    res.json(user);
  } catch (err) {
    console.log("Error while fetching users", err);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/user", async (req, res) => {
  try {
    const deleteData = await User.findByIdAndDelete(req.body.id);
    res.json("User Deleted Suucessfully");
  } catch (err) {
    console.log("Error while deleting user", err);
    res.status(500).send("Internal Server Error");
  }
});

app.patch("/user/:id", async (req, res) => {
  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "gender",
      "age",
      "photoUrl",
      "about",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(req.body).every((key) =>
      ALLOWED_UPDATES.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error("Invalid Update");
    }

    if (req.body?.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }

    await User.findByIdAndUpdate(req.params?.id, req.body, {
      runValidators: true,
    });
    res.json("User Updated Suucessfully");
  } catch (err) {
    console.log("Error while updating user", err);
    res.status(400).send("INVALID UPDATE: " + err?.message);
  }
});

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const { firstName, lastName, emailId } = req.body;

    // Creating new instance of User model.
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
    });

    const userData = await user.save();
    console.log("User Created Successfully", userData);

    res.status(201).send("User Created Successfully");
  } catch (err) {
    res.status(400).send("SIGNUP ERROR: " + err?.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      res.status(400).json("Invalid Credentials");
    }

    const isValidUser = await bcrypt.compare(password, user?.password);

    if (isValidUser) {
      const token = jwt.sign({ _id: user._id }, "Shraddha@123");

      res.cookie("token", token);

      res.json("Successful Login");
    }
  } catch (err) {
    res.status(400).json("LOGIN ERROR: " + err?.message);
  }
});

app.post("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Please Login");
    }

    const decodedMessage = jwt.verify(token, "Shraddha@123");
    const user = await User.findById(decodedMessage._id);

    res.json(user);
  } catch (err) {
    res.status(400).json("PROFILE ERROR: " + err?.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database Connected Suucessfully..!!");
    app.listen(3000, () => {
      console.log("Server is listening on port 3000");
    });
  })
  .catch((err) => {
    console.log("Error while connecting to Database", err);
  });
