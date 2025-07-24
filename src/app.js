const express = require("express");

const app = express();

app.get("/user", (req, res) => {
  res.send({
    name: "Shraddha",
    surname: "Desai",
  });
});

app.post("/user", (req, res) => {
  console.log("Saving data to DB....");
  res.send("Saved data to Database..!!");
});

app.use("/test", (req, res) => {
  res.send("Hello from Server..!!");
});

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
