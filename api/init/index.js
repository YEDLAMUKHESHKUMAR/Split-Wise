const mongoose = require("mongoose");
const initData = require("./data.js");

const User = require("../models/user.js");

// app.use(express.json());
// app.use(cors());

// app.use(express.json({ extended: false }));

mongoose
  .connect("mongodb://127.0.0.1:27017/SplitWise")
  .then(() => console.log("connected to db"))
  .catch(console.error);

const initDB = async () => {
  await User.deleteMany({});
  await User.insertMany(initData.data);
};

// initDB();
