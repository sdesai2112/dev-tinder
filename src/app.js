const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

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

app.patch("/user", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.id, req.body);
    res.json("User Updated Suucessfully");
  } catch (err) {
    console.log("Error while updating user", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/signup", async (req, res) => {
  // Creating new instance of User model.
  const user = new User(req.body);

  const userData = await user.save();
  console.log("User Created Successfully", userData);

  res.status(201).send("User Created Successfully");
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
