import mongoose from "mongoose";

const subBoardsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    background: { type: String, default: null },
})

const SubBoard = mongoose.model('subBoards', subBoardsSchema)
export default SubBoard