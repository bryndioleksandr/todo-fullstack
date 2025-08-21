import express from 'express';
import {createTask, getTaskById, getTasks, getTasksByStatus, deleteTask, updateTask} from "../controllers/Task.js";

const taskRouter  = express.Router();

taskRouter.post('/task', createTask);
taskRouter.get('/tasks', getTasks);
taskRouter.get('/tasks/:taskId', getTaskById);
taskRouter.get('/tasks-by-status', getTasksByStatus);
taskRouter.put('/tasks/:taskId', updateTask);
taskRouter.delete('/tasks/:taskId', deleteTask);

export default taskRouter;


