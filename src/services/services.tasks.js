import Task from '../model/model.tasks.js';
import Comment from '../model/model.comments.js';
import User from '../model/model.users.js';
import Team from '../model/model.teams.js';

// create after login by admin
const createNewTask = async (taskData) => {
    try {
        // create a new task
        const newTask = await Task.create({
            title: taskData.title,
            description: taskData.description,
            // dueTime,
            // documentLink,
            // githubRepo,
            creator: taskData.creator,
            teamId: taskData.teamId,
            subBoards: taskData.subBoards,
            comments: taskData.comments,
            createdAt: new Date().toISOString()
        })
        // save task in teams
        if (taskData.teamId) {
            const team = await Team.findById(taskData.teamId);
            if (!team) {
                throw new Error('Team not found');
            }
            team.tasks.push(newTask._id);
            await team.save();
        }
        return newTask
    } catch (error) {
        throw new Error(error);
    }
}

// get all tasks
const getAllTasks = async () => {
    try {
        const tasks = await Task.find({}) // Sử dụng find({}) để lấy tất cả tasks
            .populate({
                path: 'creator',
                model: 'members',
                select: 'userName email fullName' 
            })
            .populate({
                path: 'subBoards',
                model: 'subBoards',
                select: 'name background'
            })
            .populate({
                path: 'comments',
                model: 'comments', // Sửa lại model name từ 'comments' thành 'Comment'
                select: 'content createdAt userId',
                populate: {
                    path: 'userId',
                    model: 'members',
                    select: 'userName email'
                }
            })
            .sort({ createdAt: -1 }); // sắp xếp task mới nhất lên đầu

        if (!tasks || tasks.length === 0) {
            return [];      
        }

        // Format lại từng task trong mảng tasks
        const formattedTasks = tasks.map(task => {
            const formattedComments = task.comments.map(comment => {
                const userDetails = comment.userId ? {
                    id: comment.userId._id,
                    username: comment.userId.userName,
                    email: comment.userId.email
                } : null;
                return {
                    id: comment._id,
                    content: comment.content,
                    createdAt: comment.createdAt,
                    user: userDetails
                };
            });
            const formattedSubBoards = task.subBoards && Array.isArray(task.subBoards) ? task.subBoards.map(subBoard => {
                if (!subBoard) return null; 
                return {
                    id: subBoard._id,
                    name: subBoard.name,
                    background: subBoard.background
                };
            }).filter(sb => sb !== null) : [];

            const creatorDetails = task.creator ? {
                id: task.creator._id,
                username: task.creator.userName,
                email: task.creator.email,
                fullName: task.creator.fullName
            } : null;

            return {
                ...task.toObject(),
                comments: formattedComments,
                creator: creatorDetails,
                subBoards: formattedSubBoards
            };
        });

        return formattedTasks;
    } catch (error) {
        console.error("Error in getAllTasks:", error);
        throw error; 
    }
};
// get task by id
const getTaskByIdService = async (taskId) => {
    try {
        const task = await Task.findById(taskId)
            .populate({
                path: 'creator',
                model: 'members',
                select: 'userName email'
            })
            .populate({
                path: 'subBoards',
                model: 'subBoards',
                select: 'name background'
            })
            .populate({
                path: 'comments',
                model: 'comments',
                populate: {
                    path: 'userId',
                    model: 'members',
                    select: 'userName email'
                }
            })
        if (!task) {
            throw new Error('Task not found')
        }

        // Format comments
        const formattedComments = task.comments && Array.isArray(task.comments) ? task.comments.map(comment => {
            if (!comment) return null;
            const userDetails = comment.userId ? {
                id: comment.userId._id,
                username: comment.userId.userName,
                email: comment.userId.email
            } : null;
            return {
                id: comment._id,
                content: comment.content,
                createdAt: comment.createdAt,
                user: userDetails
            };
        }).filter(c => c !== null) : [];

        // Format subBoards
        const formattedSubBoards = task.subBoards && Array.isArray(task.subBoards) ? task.subBoards.map(subBoard => {
            if (!subBoard) return null;
            return {
                id: subBoard._id,
                name: subBoard.name,
                background: subBoard.background
            };
        }).filter(sb => sb !== null) : [];

        // Format creator
        const creatorDetails = task.creator ? {
            id: task.creator._id,
            username: task.creator.userName,
            email: task.creator.email,
            fullName: task.creator.fullName 
        } : null;

        const formattedTask = {
            ...task.toObject(), 
            comments: formattedComments,
            subBoards: formattedSubBoards, 
            creator: creatorDetails
        };
        return formattedTask
    } catch (error) {
        throw new Error(error);
    }
}

// update task (duetime, documentlink, githubrepo)
const updateTaskService = async (taskId, taskData) => {
    try {
        const task = await Task.findOne({ _id: taskId })
        if (!task) {
            throw new Error('Task not found')
        }
        task.dueTime = taskData.dueTime
        task.documentLink = taskData.documentLink
        task.githubRepo = taskData.githubRepo
        await task.save()
        return task
    } catch (error) {
        throw new Error(error);
    }
}

// delete task
const deleteTaskService = async (taskId) => {
    try {
        const task = await Task.findOne({ _id: taskId })
        if (!task) {
            throw new Error('Task not found')
        }
        // xoa task
        await Task.deleteOne({ _id: taskId })
        // xoa comment trong task
        await Comment.deleteMany({ taskId: taskId })
        return task
    } catch (err) {
        throw new Error(err);
    }
}
export default {
    createNewTask,
    getAllTasks,
    getTaskByIdService,
    updateTaskService,
    deleteTaskService
}