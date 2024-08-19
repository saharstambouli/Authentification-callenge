const User = require('../models/user.schema')
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl = {
    register : async (req,res)=>{
        try {
            const {firstName,lastName,email,password} = req.body;
            const error = validationResult(req)
            if(!error.isEmpty()){
                return res.status(400).json({error:error.mapped()})
            }
            const existEmail = await User.findOne({email});
            if(existEmail){
                return res.status(400).json('Email already exist !!')
            }
            const hash = await bcrypt.hash(password,10)
            const newUser = new User ({firstName , lastName , email , password:hash})
            await newUser.save()
            return res.status(200).json('User created successfully')
        } catch (error) {
            console.log('error', error)
            return res.status(500).json(error)
        }
    },

    login : async (req,res) => {
        try {
            const {email,password} = req.body

            const existUser = await User.findOne({email})
            if(!existUser){
                return res.status(404).json("Email not found!")
            }

            const isMatch = await bcrypt.compare(password , existUser.password )

            if(!isMatch){
                return res.status(400).json('Wrong password')
            }
            const payload = {
                id : existUser._id,
                firstName : existUser.firstName,
                lastName : existUser.lastName,
                email : existUser.email
            }
            const accessToken = await  jwt.sign(
                payload,
                process.env.ACCESS_TOKEN,
                {expiresIn : process.env.TOKEN_EXPIRE_IN}
            )
            res.json({accessToken , user : existUser })
        } catch (error) {
            console.log('error', error)
            return res.status(500).json(error)
        }
    }
}

module.exports = userCtrl