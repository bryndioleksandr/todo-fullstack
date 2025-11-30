import express from "express";
import userRouter from "../routes/User.js";
import taskRouter from "../routes/Task.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/task", taskRouter);
router.get('/health', (req, res) => {
    res.status(200).send('Server is alive');
});

export default router;
