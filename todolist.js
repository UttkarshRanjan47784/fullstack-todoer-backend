import jwt from 'jsonwebtoken'
import mongoose, { Mongoose } from 'mongoose';
import env from "dotenv"

env.config()
const url = process.env.MONGO_URL;

const todoListListSchema = new mongoose.Schema({
    todoListName : String
});

const userColl = new mongoose.model(`todoer-users`);

async function getAllTodoLists (req, res){
    try {
        await mongoose.connect(url);
        let token = req.headers["authorization"]
        let username = jwt.decode(token)["username"];
        let user = await userColl.findOne({
            username : username
        });
        jwt.verify(token, user.password);
        const collectionString = `todoer-${user.username}-todoLists`;
        const todoListCollection = new mongoose.model(collectionString, todoListListSchema);
        let response = await todoListCollection.find();
        res.json(response)

    } catch (error) {
        res.json(`operation getAllTodoList failed : ${error.message}`)
    }
    await mongoose.connection.close()
}

async function addTodoList(req, res) {
    try {
        await mongoose.connect(url);
        let token = req.headers["authorization"]
        let username = jwt.decode(token)["username"];
        const collectionString = `todoer-${username}-todoLists`;
        const todoListCollection = new mongoose.model(collectionString, todoListListSchema);
        let newListName = new todoListCollection(req.body)
        await newListName.save()
    } catch (error) {
        res.json(`operation addToTodoList failed : ${error.message}`)
    }
    await mongoose.connection.close()
}

export { getAllTodoLists, addTodoList }