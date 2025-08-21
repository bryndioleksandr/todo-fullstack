import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";

const Task = sequelize.define("Task", {
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: false},
    status: { type: DataTypes.ENUM("todo", "in-progress", "done"), defaultValue: "todo"}
});

User.hasMany(Task, {onDelete: "CASCADE"});
Task.belongsTo(User);

export default Task;
