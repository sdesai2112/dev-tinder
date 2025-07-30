const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Shraddha:MaziBaleno%40555@cluster0.sejv9i2.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
