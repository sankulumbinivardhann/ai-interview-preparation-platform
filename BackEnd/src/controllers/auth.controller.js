const userModel = require("../models/user.model")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const tokenBlackListModel = require("../models/blacklist.model")

/**
 * @name registerUserController
 * @description Register a new user, expects username, email and password in the request body
 * @access Public
 */

async function registerUserController(req, res){
   const{username, email, password} = req.body 
   if(!username || !email || !password){
    return res.status(400).json({
      message: "please provide username, email and password"
    })
   }

   const isUserAlreadyExists = await userModel.findOne({
    $or: [{username},{email}]
   })
   if(isUserAlreadyExists){
    /*isUserAlreadyExits.username === username */
    return res.status(400).json({
      message: "account already exists with this email or username"
    })
   }
   const hash = await bcryptjs.hash(password, 10)
   const user = await userModel.create({
    username,
    email,
    password: hash
   })
   const token = jwt.sign({
    id: user._id, username: user.username
   },
   process.env.JWT_SECRET,
   {expiresIn: "1d"}
  )
  res.cookie("token", token)
  res.status(201).json({
    message: "User Registered Successfully",
    user:{
      id: user._id,
      username: user.username,
      email: user.email
    }
  })
   
} 


/**
 * @name loginuserController
 * @description login a new user, expects username, email and password in the request body
 * @access Public
 */

async function loginUserController(req, res){
  const {email, password} = req.body
  const user = await userModel.findOne({email})
  if(!user){
    return res.status(400).json({
      message: "Invalid email or Password"
    })
  }
  const isPasswordValid = await bcryptjs.compare(password, user.password)
  if(!isPasswordValid){
    return res.status(400).json({
      message:"Invalid email or Password"
    })
  }
  const token = jwt.sign(
    {id: user._id, username: user.username},
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
  )
  res.cookie("token", token)
  res.status(201).json({
    message: "user Logged in SuccessFully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    }
  })
}


/**
 * @name loginuserController
 * @description login a new user, expects username, email and password in the request body
 * @access Public
 */

async function logoutUserController(req, res){
  const token = req.cookies.token

  if(token){
    await tokenBlackListModel.create({token})
  }
  res.clearCookie("token")
  res.status(200).json({
    message: "user Logged Out SuccessFully"
  }) 
}


/**
 * @name getMeController
 * @description get the current loggedIn user details expects token the request cookie
 * @access Private
 */

async function getMeController(req, res){
  const user = await userModel.findById(req.user.id)
  res.status(200).json({
    message: "user details fetched successfully",
    user:{
      id: user._id,
      username: user.username,
      email: user.email
    }
  })
}

module.exports = {
  registerUserController, loginUserController, logoutUserController, getMeController
};