import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import env from "dotenv"

env.config();

const url = process.env.MONGO_URL;

const userSchema = new mongoose.Schema({
    username : String,
    password : String
})

const userModel = mongoose.model(`todoer-users`, userSchema);

async function checkUser (name) {
    try{
        let temp = await userModel.findOne({
            username : name
        })
        if (temp != null || temp != undefined){
            console.log(`lol`)
            return true;
        }
        return false;
    } catch (error){
        console.log(error)
    }
    
}

async function registerUser (req, res) {
    try {
        await mongoose.connect(url);
        let user = new userModel(req.body);

        if (await checkUser(req.body["username"])){
            console.log(`F`);
            throw new Error(`ERROR : username already taken`);
        }            

        await user.save();

        let token = jwt.sign({
            username : req.body["username"]
        }, req.body["password"])

        res.json(token);

    } catch (error) {
        res.json(error.message);
    }
    mongoose.connection.close();
}

export { registerUser }