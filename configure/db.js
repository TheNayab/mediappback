const mongoose = require("mongoose");

const connectToDb = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Connect to database Successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = connectToDb;
