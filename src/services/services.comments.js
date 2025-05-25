import Task from '../model/model.tasks.js';
import Comment from '../model/model.comments.js';
import User from '../model/model.users.js';

// add comment to task
const addCommentToTaskService = async (taskId, commentData) => {
    try {
        const task = await Task.findOne({ _id: taskId })
        if (!task) {
            throw new Error('Task not found')
        }
        const newComment = await Comment.create({
            content: commentData.content,
            taskId: task._id,
            userId: commentData.userId,
            createdAt: new Date().toISOString()
        })
        task.comments.push(newComment._id)
        await task.save()

        const populatedComment = await Comment.findOne({ _id: newComment._id })
            .populate({
                path: 'userId',
                select: 'userName email',
                model: 'members'
            })
        
            return populatedComment
    } catch (error) {
        throw new Error(error)
    }
}

// get all comments of a task
const getAllCommentsOfATaskService = async (taskId) => {
    try {
        const comments = await Comment.find({ taskId: taskId })
        if (!comments) {
            throw new Error('No comments found')
        }
        return comments
    } catch(error) {
        throw new Error(error)
    }
}
export default {
    addCommentToTaskService,
    getAllCommentsOfATaskService
}