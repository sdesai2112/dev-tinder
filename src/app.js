const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("Hello from Server..!!");
});

app.use("/hello", (req, res) => {
  res.send("Hello Hello Hello...!!");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
