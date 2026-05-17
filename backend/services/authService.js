const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

// generate token
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

const registerUser = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("All fields required");
  }

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await argon2.hash(password);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password required");
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    throw new Error("User not found");
  }

  if (!user.password || typeof password !== "string") {
    throw new Error("Invalid login data");
  }

  const isMatch = await argon2.verify(user.password, password);

  if (!isMatch) {
    throw new Error("Invalid password");
  }

  const token = generateToken({ _id: user._id });

  return {
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};
module.exports = {
  registerUser,
  loginUser,
};


// const User = require("../models/User");
// const argon2 = require("argon2");
// const jwt = require("jsonwebtoken");

// //generate token 
// const generateToken = (user) => {
//   return jwt.sign({
//     id:user._id,
//     email:user.email,
//     role:user.role,
//   },process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
// }
  

// const registerUser = async ({ name, email, password }) => {
//  // ✅ validation
//   if (!name || !email || !password) {
//     throw new Error("All fields required");
//   }

//   // ✅ check existing user
//   const existing = await User.findOne({ email });
//   if (existing) {
//     throw new Error("User already exists");
//   }
//   //hash password 
//   const hashedPassword = await argon2.hash(password);

//   //create user
//   const user = await User.create({
//     name,
//     email,
//     password:hashedPassword,
//   });

//   return user;
// };

// const loginUser = async (email, password) => {
//   const user = await User.findOne({ email });

//   if (!user) {
//     throw new Error("User not found");
//   }
// const isMatch = await argon2.verify(user.password, password);

//   if (!isMatch) {
//     throw new Error("Invalid password");
//   }

//   // 🔥 JWT TOKEN CREATE
//   const token = generateToken(user);

//   return {
//     user,
//     token,
//   };
// };


// module.exports = {
//   registerUser,
//   loginUser,
// };

