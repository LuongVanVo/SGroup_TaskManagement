import servicesTasks from "../services/services.tasks.js";

// create a new task
// create after login by admin
const createTask = async (req, res) => {
    try {
        if (!req.member || !req.member.id) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: Admin creator information not found'
            })
        } 
        const { title, description, teamId } = req.body
        const taskData = {
            title,
            description,
            // duetime trong 5 ngay toi
            // dueTime: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
            // documentLink,
            // githubRepo,
            creator: req.member.id,
            teamId,
            // subBoards,
            // comments
        }
        const newTask = await servicesTasks.createNewTask(taskData);
        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: newTask
        })
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: error.message
         })
    }
}

// get all tasks
const getAllTasks = async (req, res) => {
    try {
        const tasks = await servicesTasks.getAllTasks()
        return res.status(200).json({
            success: true,
            message: "Get all tasks successfully",
            data: tasks
        })
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: error.message
         })
    }
}

// get task by id
const getTaskById = async (req, res) => {
    try {
        const { taskId } = req.params
        if (!taskId) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: taskId is required'
            })
        }
        const task = await servicesTasks.getTaskByIdService(taskId)
        return res.status(200).json({
            success: true,
            message: "Get task successfully",
            data: task
        })
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: error.message
         })
    }
}

// update task (duetime, documentlink, githubrepo)
const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params
        const { dueTime, documentLink, githubRepo } = req.body
        if (!taskId) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: taskId is required'
            })
        }
        if (!dueTime || !documentLink || !githubRepo) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: dueTime, documentLink, githubRepo are required'
            })
        }
        const task = await servicesTasks.updateTaskService(taskId, {
            dueTime,
            documentLink,
            githubRepo
        })
        return res.status(200).json({
            success: true,
            message: "Update task successfully",
            data: task
        })
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: error.message
         })
    }
}

// delete task
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params
        if (!taskId) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: taskId is required'
            })
        }
        const task = await servicesTasks.deleteTaskService(taskId)
        return res.status(200).json({
            success: true,
            message: "Delete task successfully",
            data: task
        })
    } catch (error) {
        return res.status(500).json({ 
            success: false,
            message: error.message
         })
    }
}
export default {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
}