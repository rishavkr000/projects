const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      enum: ["Mr", "Mrs", "Miss"],
      trim: true,
    },
    fname: {
      type: String,
      required: true,
      trim: true,
    },
    lname: {
      type: String,
      require: true,
      trim: true,
    },
    email: {
      type: String,
      lowercase: true,
      required: true,  
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true });

module.exports = mongoose.model("Author", authorSchema); //authors

