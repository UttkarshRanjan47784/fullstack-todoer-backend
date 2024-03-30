import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import env from "dotenv"

env.config()

const url = process.env.MONGO_URL;
const userModel = mongoose.model(`todoer-users`);

async function verifyUser (req, res) {
    try {
        await mongoose.connect(url)
        let token = req.headers["authorization"]
        let username = jwt.decode(token)["username"];
        let user = await userModel.findOne({
            username : username
        });
        jwt.verify(token, user.password);
        res.json({
            stat : true,
            msg : `${user.username}`
        })
    } catch (error) {
        res.json({
            stat : false,
            msg : `Unauthorized User : ${error.message}`
        })
    }
    await mongoose.connection.close()
}

export { verifyUser }