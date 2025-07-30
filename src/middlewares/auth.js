const adminAuth = (req, res, next) => {
  let token = "xyz";

  if (token === "xyz") {
    console.log("Authentication Successful");
    next();
  } else {
    console.log("Authentication Failed");
    res.status(401).send("Unauthorized Access");
  }
};

const userAuth = (req, res, next) => {
  let token = "xyz";

  if (token === "xyz") {
    console.log("Authentication Successful");
    next();
  } else {
    console.log("Authentication Failed");
    res.status(401).send("Unauthorized Access");
  }
};

module.exports = { adminAuth, userAuth };
