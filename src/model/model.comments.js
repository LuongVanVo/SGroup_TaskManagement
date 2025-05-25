import mongoose from "mongoose"

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    createdAt: { type: Date, default: Date.now },
})

const Comment = mongoose.model('comments', commentSchema)
export default Comment