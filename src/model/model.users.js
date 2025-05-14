import mongoose from 'mongoose'

const memberSchema = new mongoose.Schema({
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    tasks: { type: [mongoose.Schema.Types.ObjectId], ref: 'Task', required: true },
    teams: { type: [mongoose.Schema.Types.ObjectId], ref: 'Team', required: true },
})

const Member = mongoose.model('Member', memberSchema)

export default Member
