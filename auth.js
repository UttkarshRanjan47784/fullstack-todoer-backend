import jwt from 'jsonwebtoken'
import mongoose, { mongo } from 'mongoose'
import env from "dotenv"
import bcrypt from "bcrypt"

env.config();

const url = process.env.MONGO_URL;
const secret = process.env.SERVER_SECRET;
const salt = process.env.SALT_ROUNDS;

const userSchema = new mongoose.Schema({
    username : String,
    password : String
})

const userModel = mongoose.model(`todoer-users`, userSchema);

async function loginUser (req, res) {
    try {
        await mongoose.connect(url);
        let temp = await userModel.findOne({
            username : req.body["username"]
        });
        if (temp == null || temp == undefined)
            res.json(`User does not exist!`);

        bcrypt.compare(req.body["password"], temp.password, function(err, result) {
            if (err){
                 res.json(err.message)
            }
            if (result) {
                let token =  jwt.sign({
                    username : req.body["username"]
                }, secret);
                res.json({
                    msg : true,
                    token : token
                });
            }
            else 
                res.json(`Invalid Password`)
        });
    } catch (error) {
        res.json(error.message)
    }
    await mongoose.connection.close();
}

async function registerUser (req, res) {
    try {
        bcrypt.hash(req.body["password"], Number(salt), async (err, hash) => {
            if (err){
                console.log(err.message)
                res.send({
                    stat : `fail`,
                    msg : err.message
                });
            }
            else {
                await mongoose.connect(url);
                let temp = await userModel.findOne({
                    username : req.body["username"]
                });
                if (temp != null || temp != undefined){
                    res.send({
                        stat : `fail`,
                        msg : `User already exists`
                    });
                    return
                }
                    
                let user = new userModel({
                    username : req.body["username"],
                    password : hash
                });
                await user.save();
                let token = jwt.sign({
                    username : req.body["username"]
                }, secret)
                res.json({
                    stat : `pass`,
                    msg : token
                });  
            }        
        });
    } catch (error) {
        res.send({
            stat : `fail`,
            msg : error.message
        });
    }
    await mongoose.connection.close();
}

export { registerUser, loginUser }