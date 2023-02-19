const express = require("express");
const { UserModel } = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userRouter = express.Router();
/**
* @swagger
* components:
*   schemas:
*       User:
*           type: object
*           properties:
*               id:
*                   type: string
*                   description: The auto-generated id of the user
*               name:
*                   type: string
*                   description: The user name
*               email:
*                   type: string
*                   description: The user email
*               age:
*                   type: integer
*                   description: Age of the user
*/
/**
 * @swagger
 * tags:
 *    name: Users
 *    description: All the API routes related to User
 */
/**
* @swagger
* /users:
*   get:
*       summary: This will get all the user data from the database
*       tags: [Users]
*       responses:
*               200:
*                   description: The list of all the users
*                   content:
*                       application/json:
*                           schema:
*                               type: array
*                               item:
*                                   $ref: "#/components/schemas/User"
*
*/
userRouter.get("/",async (req,res)=>{
    const users=await UserModel.find()
    res.send(users)
    })



/**
* @swagger
* /users/register:
*   post:
*       summary: To post the details of a new user
*       tags: [Users]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*   responses:
*       200:
*           description: The user was successfully registered
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       500:
*           description: Some server error
*/

userRouter.post("/register", async (req, res) => {
  const { email, pass, name, age } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, secure_password) => {
      if (err) {
        console.log(err);
      } else {
        const user = new UserModel({ email, pass: secure_password, name, age });
        await user.save();
        res.send("Registered");
      }
    });
  } catch (err) {
    res.send("Error in registering the user");
    console.log(err);
  }
});

/**
* @swagger
* /users/login:
*   post:
*       summary: To login the user
*       tags: [Users]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*   responses:
*       200:
*           description: Login successful
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       500:
*           description: Some server error
*/

userRouter.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  console.log(email, pass);
  try {
    const user = await UserModel.find({ email });
    const hashed_pass = user[0].pass;
    if (user.length > 0) {
      bcrypt.compare(pass, hashed_pass, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, process.env.key);
          res.send({ msg: "Login Successful", token: token });
        } else {
          res.send("Wrong Credntials");
        }
      });
    } else {
      res.send("Wrong Credntials");
    }
  } catch (err) {
    res.send("Something went wrong");
    console.log(err);
  }
});

module.exports = {
  userRouter,
};
