import SubBoard from "../model/model.subboards.js";
import Task from "../model/model.tasks.js";
import { uploadImage } from "../utils/uploadImage.js";


// add subboard to task
const addSubBoardToTaskService = async (taskId, subBoardData) => {
    try {
        const task = await Task.findOne({ _id: taskId })
        if (!task) {
            throw new Error('Task not found')
        }
        const subBoard = await SubBoard.create(subBoardData)
        task.subBoards.push(subBoard._id)
        // luu subboard vao database subbo
        await subBoard.save()
        await task.save()
        return subBoard
    } catch (error) {
        throw new Error(error)
    }
}

// Update subboard on task
const updateSubBoardOnTaskService = async(subBoardId, subBoardData) => {
    try {
        const subBoard = await SubBoard.findOne({ _id: subBoardId })
        if (!subBoard) {
            throw new Error('Subboard not found')
        }
        subBoard.name = subBoardData.name
        // save update
        await subBoard.save()
        return subBoard
    } catch (error) {
        throw new Error(error)
    }
}

// delete subboard on task
const deleteSubBoardOnTaskService = async(subBoardId) => {
    // delete subboard both in subboard and task
    try {
        const subBoardInTask = await Task.findOne({ subBoards: subBoardId })
        if (!subBoardInTask) {
            throw new Error('Subboard not found in task')
        }
        const subBoard = await SubBoard.findOne({ _id: subBoardId })
        if (!subBoard) {
            throw new Error('Subboard not found')
        }
        // remove subboard from task
        subBoardInTask.subBoards = subBoardInTask.subBoards.filter((subBoard) => subBoard._id.toString() !== subBoardId)
        // remove subboard from database
        await subBoard.deleteOne({ _id: subBoardId })
        // save update
        await subBoardInTask.save()
        return subBoard
    } catch (error) {
        throw new Error(error)
    }
}

// upload subboard image
const uploadSuboardImageService = async (subBoardId, filePath) => {
    try {
        const subboard = await SubBoard.findOne({ _id: subBoardId })
        if (!subboard) {
            throw new Error('Subboard not found')
        }
        const imageUrl = await uploadImage(filePath)
        subboard.background = imageUrl
        // save update
        await subboard.save()
        return subboard
    } catch (error) {
        throw new Error(error)
    }
}
export default {
    addSubBoardToTaskService,
    updateSubBoardOnTaskService,
    deleteSubBoardOnTaskService,
    uploadSuboardImageService
}