import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import env from "dotenv"

env.config()
const url = process.env.MONGO_URL;
const secret = process.env.SERVER_SECRET;

const todoListListSchema = new mongoose.Schema({
    todoListName : String,
    taskList : [{
        taskName : String,
        taskStatus : Boolean
    }]
});

const userColl = new mongoose.model(`todoer-users`);

async function getAllTodoLists (req, res){
    try {
        await mongoose.connect(url);
        let token = req.headers["authorization"]
        jwt.verify(token, secret);
        let username = jwt.decode(token)["username"];
        const collectionString = `todoer-${username}-todoLists`;
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
        res.json(`Sent`)
    } catch (error) {
        res.json(`operation addToTodoList failed : ${error.message}`)
    }
    await mongoose.connection.close()
}

async function deleteTodoList(req, res) {
    try {
        await mongoose.connect(url);
        let token = req.headers["authorization"]
        let username = jwt.decode(token)["username"];
        const collectionString = `todoer-${username}-todoLists`;
        const todoListCollection = new mongoose.model(collectionString, todoListListSchema);
        let newListName = await todoListCollection.findOneAndDelete({
            todoListName: req.body.todoListName
        })
        res.json(newListName);
    } catch (error) {
        res.json(`operation addToTodoList failed : ${error.message}`)
    }
    await mongoose.connection.close()
}

export { getAllTodoLists, addTodoList, deleteTodoList }