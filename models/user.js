const { createHmac, randomBytes } = require("node:crypto");
const { Schema, model } = require("mongoose");

const {createTokenForUser} = require("../services/authentication");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/avatar1.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Hash the password before saving a new user
 */
userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();

  //  Generate a unique salt for each user
  const salt = randomBytes(16).toString("hex");

  //  Hash the password using the generated salt
  user.password = createHmac("sha256", salt).update(user.password).digest("hex");

  user.salt = salt;
  next();
});

/**
 *  Match the entered password with stored hashed password
 */

userSchema.static("matchPasswordAndGenerateToken", async function (password, email) {
  const user = await this.findOne({ email });

  if (!user) throw new Error("User not found");

  //  Hash the provided password using the stored salt
  const userProvidedHashed = createHmac("sha256", user.salt).update(password).digest("hex");

  if (userProvidedHashed !== user.password) throw new Error("Password is incorrect");

  const token = createTokenForUser(user);
  return token;
 
});




const User = model("User", userSchema);
module.exports = User;
