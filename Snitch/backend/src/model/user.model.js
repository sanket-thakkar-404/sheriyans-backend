import mongoose from "mongoose";
import bcrypt from "bcrypt"


const userSchema = new mongoose.Schema({

  fullname: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
    minlength: [3, "Full name must be at least 3 characters long"],
    maxlength: [50, "Full name cannot exceed 50 characters"],
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
  },

  mobileNo: {
    countryCode: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
      },
      trim: true,
      match: [/^\+\d{1,4}$/, "Please provide a valid country code (e.g. +91)"],
    },

    number: {
      type: String,
      required: function () {
        return this.authProvider !== "google";
      },
      trim: true,
      match: [/^\d{6,15}$/, "Please provide a valid mobile number"],
    },
  },

  password: {
    type: String,
    required: function () {
      return this.authProvider !== "google";
    },
    minlength: [6, "Password must be at least 6 characters long"],
    select: false,
  },

  googleId: {
    type: String,
    default: null,
  },

  authProvider: {
    type: String,
    enum: ["local", "google"],
    default: "local",
  },

  avatar: {
    type: String,
    default: "",
  },

  role: {
    type: String,
    enum: {
      values: ["user", "seller"],
      message: "Role must be one of: user, seller",
    },
    default: "user",
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  lastLogin: {
    type: Date,
    default: null,
  },
},
  { timestamps: true }
);



// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});


// Compare entered password with hashed password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};


const userModel = mongoose.model("User", userSchema)


export default userModel;