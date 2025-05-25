import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title : { type: String, required: true },
    description : { type: String, required: true },
    dueTime: { type: Date, default: () => new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) }, // default due time is 5 days from now
    documentLink: { type: String, default: null },
    githubRepo: { type: String, default: null },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team', required: true },
    subBoards: { type: [mongoose.Schema.Types.ObjectId], ref: 'SubBoard', required: true },
    comments: { type: [mongoose.Schema.Types.ObjectId], ref: 'Comment', required: true },
    createdAt: { type: Date, default: Date.now },
})

const Task = mongoose.model('tasks', taskSchema)
export default Task