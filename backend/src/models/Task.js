import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";

const Task = sequelize.define("Task", {
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: false},
    status: { type: DataTypes.ENUM("todo", "in-progress", "done"), defaultValue: "todo"},
    priority: {type: DataTypes.INTEGER, allowNull: false, validate:{min:1, max:10}, defaultValue:1},
});

User.hasMany(Task, {onDelete: "CASCADE"});
Task.belongsTo(User);

export default Task;
