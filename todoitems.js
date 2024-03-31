import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import env from "dotenv"

env.config()
const url = process.env.MONGO_URL;

const todoListListSchema = new mongoose.Schema({
    todoListName : String,
    taskList : [{
        taskName : String,
        taskStatus : Boolean
    }]
});


const userColl = new mongoose.model(`todoer-users`);

async function addTask (req, res) {
    try {
        await mongoose.connect(url);
        let token = req.headers["authorization"]
        let username = jwt.decode(token)["username"];

        const collString = `todoer-${username}-todolists`;
        const taskCollection = new mongoose.model(collString, todoListListSchema) || new mongoose.model(collString);
        let temp = await taskCollection.findOne ({
            todoListName : req.body.todoListName
        })
        temp.taskList.push({
            taskName : req.body.taskTitle,
            taskStatus : req.body.taskStatus
        })
        await temp.save()
        res.json(true)
    } catch (error){
        res.json(`Operation Failed! ${error.message}`)
    }
    await mongoose.connection.close()
}

async function updateTask (req, res) {
    try {
        await mongoose.connect(url);
        let token = req.headers["authorization"]
        let username = jwt.decode(token)["username"];

        const collString = `todoer-${username}-todolists`;
        const taskCollection = new mongoose.model(collString, todoListListSchema) || new mongoose.model(collString); await taskCollection.findOneAndUpdate ({
            todoListName : req.body.todoListName
        }, {
            taskList : req.body.newList
        })
    } catch (error){
        res.json(`Operation Failed! ${error.message}`)
    }
    await mongoose.connection.close()
}

async function deleteTask (req, res) {
    try {
        await mongoose.connect(url);
        let token = req.headers["authorization"]
        let username = jwt.decode(token)["username"];

        const collString = `todoer-${username}-todolists`;
        const taskCollection = new mongoose.model(collString, todoListListSchema) || new mongoose.model(collString);
        await taskCollection.findOneAndUpdate ({
            todoListName : req.body.todoListName
        }, {
            taskList : req.body.newList
        })
    } catch (error){
        res.json(`Operation Failed! ${error.message}`)
    }
    await mongoose.connection.close()
}


export { addTask, updateTask, deleteTask }