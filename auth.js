import jwt from 'jsonwebtoken'
import mongoose, { mongo } from 'mongoose'
import env from "dotenv"

env.config();

const url = process.env.MONGO_URL;
const secret = process.env.SERVER_SECRET;

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
            throw new Error(`User does not exist!`);
        if (req.body['password'] == temp.password){
            let token =  jwt.sign({
                username : req.body["username"]
            }, secret)
            console.log(`token generated`)
            res.json({
                msg : true,
                token : token
            });
        }
        else
            throw new Error(`Invalid Password`);
    } catch (error) {
        res.json(error.message)
    }
    mongoose.connection.close();
}

async function registerUser (req, res) {
    try {
        await mongoose.connect(url);
        let user = new userModel(req.body);
        
        let temp = await userModel.findOne({
            username : req.body["username"]
        });

        if (temp != null || temp != undefined)
            throw new Error(`User already exists`);

        await user.save();

        let token = jwt.sign({
            username : req.body["username"]
        }, secret)

        res.json({
            stat : `pass`,
            msg : token
        });

    } catch (error) {
        res.send({
            stat : `fail`,
            msg : error.message
        });
    }
    mongoose.connection.close();
}

export { registerUser, loginUser }