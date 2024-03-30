import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import env from "dotenv"

env.config()
const url = process.env.MONGO_URL;

const taskListSchema = new mongoose.Schema({
    tasks : [String]
})

const userColl = new mongoose.model(`todoer-users`);

async function getAllTask (req, res) {
    try {
        await mongoose.connect(url);
        let token = req.headers["authorization"]
        let username = jwt.decode(token)["username"];
        let user = await userColl.findOne({
            username : username
        });
        const collString = `todoer-${user.username}-${req.body.listName}-tasks`;
        const taskCollection = new mongoose.model(collString, taskListSchema) || new mongoose.model(collString);
        let allTasks = await taskCollection.find();
        console.log(allTasks);
        res.json(allTasks);
    } catch (error){
        res.json(error.message)
    }
    await mongoose.connection.close()
}

export { getAllTask }