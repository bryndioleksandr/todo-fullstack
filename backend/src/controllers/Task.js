import Task from '../models/Task.js'
import {User} from '../models/User.js'
import {Op} from "sequelize";

export const createTask = async (req, res) => {
    try {
        const {title, description, status, userId} = req.body;
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({msg: "User not found"});

        const task = await Task.create({
            title,
            description,
            status,
            UserId: userId
        });
        return res.status(201).json(task);
    } catch (err) {
        return res.status(500).json({msg: err.message});
    }
}

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({include: User});
        res.json(tasks);
    } catch (err) {
        res.status(500).json({msg: err.message});
    }
};

export const getTaskById = async (req, res) => {
    try {
        const {id} = req.params;
        const task = await Task.findByPk(id, {include: User});

        if (!task) return res.status(404).json({msg: "Task not found"});

        res.json(task);
    } catch (err) {
        res.status(500).json({msg: err.message});
    }
};

export const getTasksByStatus = async (req, res) => {
    try {
        const {status} = req.query;
        if (!status) return res.status(404).json({msg: "Status is required"});

        const statusesArray = status.split(",");

        const tasks = await Task.findAll({
            where: {
                status: {[Op.in]: statusesArray}
            }
        });

        res.json(tasks);
    } catch (err) {
        res.status(500).json({msg: err.message});
    }
}


export const updateTask = async (req, res) => {
    try {
        const {id} = req.params;
        const {title, description, status} = req.body;

        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({msg: "Task not found"});

        task.title = title ?? task.title;
        task.description = description ?? task.description;
        task.status = status ?? task.status;

        await task.save();
        res.json(task);
    } catch (err) {
        res.status(500).json({msg: err.message});
    }
};

export const deleteTask = async (req, res) => {
    try {
        const {id} = req.params;
        const task = await Task.findByPk(id);
        if (!task) return res.status(404).json({msg: "Task not found"});

        await task.destroy();
        res.json({msg: "Task deleted successfully"});
    } catch (err) {
        res.status(500).json({msg: err.message});
    }
};
