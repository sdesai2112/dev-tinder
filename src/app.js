const express = require("express");

const app = express();

// ab?c - 'b' is optional: matches "/ac" or "/abc"
app.get(/^\/ab?c$/, (req, res) => {
  res.send("Call is Successful..!!");
});

app.get("/", (req, res) => {
  res.send("This is the response from general route");
});

// Accessing queries
app.get(
  "/user",
  (req, res, next) => {
    console.log(req?.query);
    next();
    // res.send({
    //   name: "Shraddha",
    //   surname: "Desai",
    // });
  },
  (req, res, next1) => {
    // next1();
    res.send("2nd Response");
  }
);

// Accessing request parameters
app.get("/employee/:empId", (req, res) => {
  console.log(req?.params);

  res.send({
    name: "Shraddha",
    surname: "Desai",
    message: "It is employee route",
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
