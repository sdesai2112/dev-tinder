const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  console.log("Req: ", req.body);
  // Creating new instance of User model.s
  const user = new User({
    firstName: "Shraddha",
    lastName: "Desai",
    emailId: "saee@gmail.com",
    password: "saee@123",
    age: 28,
  });

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
