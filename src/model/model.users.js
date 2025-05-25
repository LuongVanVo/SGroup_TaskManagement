import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'member'] },
    createdAt: { type: Date, default: Date.now },
    tasks: { type: [mongoose.Schema.Types.ObjectId], ref: 'Task', required: true },
    teams: { type: [mongoose.Schema.Types.ObjectId], ref: 'Team', required: true },
})

const Member = mongoose.model('members', memberSchema)

export default Member
