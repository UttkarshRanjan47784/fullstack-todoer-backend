import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import env from "dotenv"

const url = process.env.MONGO_URL;
const userModel = mongoose.model(`todoer-users`);

async function verifyUser (req, res) {
    try {
        let token = req.headers["authorization"]
        let username = jwt.decode(token)["username"];
        await mongoose.connect(url)
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
    mongoose.connection.close()
}

export { verifyUser }