const mongoose = require("mongoose");

const usersAccount = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: [true, "user must have email"],
    },

    password: {
      type: String,
      required: [true, "user must have a password"],
    },

    username: {
      type: String,
      unique: true,
      required: [true, "user must have a username"],
    },

    firstName: {
      type: String,
      required: [true, "user must have a last name"],
    },

    lastName: {
      type: String,
      required: [true, "user must have first name"],
    },

  
    favouriteCount: {
      type: Number,
      default: 0,
    },

    addToCount: {
      type: Number,
      default: 0,
    },

    createdAt: {
      type: Date,
      default: new Date()
    }

  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const UsersAccount = mongoose.model("usersAccount", usersAccount);

module.exports = UsersAccount;
