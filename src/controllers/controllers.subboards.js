import servicesSubboards from "../services/services.subboards.js";

// add subboard to task
const addSubBoardToTask = async (req, res) => {
    try {
        const { taskId } = req.params
        const { name } = req.body
        if (!taskId) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: taskId is required'
            })
        }
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: name is required'
            })
        }
        const subBoardData = {
            name,
            taskId
        }
        const subBoard = await servicesSubboards.addSubBoardToTaskService(taskId, subBoardData)
        return res.status(200).json({
            success: true,
            message: "Add subboard to task successfully",
            data: subBoard
        })  
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// update subboard on task
const updateSubBoardOnTask = async (req, res) => {
    try {
        const { subBoardId } = req.params
        const { name } = req.body
        if (!subBoardId) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: subBoardId is required'
            })
        }
        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: name is required'
            })
        }
        const subBoardData = {
            name
        }
        const subBoard = await servicesSubboards.updateSubBoardOnTaskService(subBoardId, subBoardData)
        return res.status(200).json({
            success: true,
            message: "Update subboard on task successfully",
            data: subBoard
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// delete subboard on task
const deleteSubBoardOnTask = async (req, res) => {
    try {
        const { subBoardId } = req.params
        if (!subBoardId) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: subBoardId is required'
            })
        }
        const subBoard = await servicesSubboards.deleteSubBoardOnTaskService(subBoardId)
        return res.status(200).json({
            success: true,
            message: "Delete subboard on task successfully",
            data: subBoard
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// upload subboard image
const uploadSubBoardImage = async (req, res) => {
    try {
        const { subBoardId } = req.params
        const { filePath } = req.body
        if (!subBoardId) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: subBoardId is required'
            })
        }
        if (!filePath) {
            return res.status(400).json({
                success: false,
                message: 'Bad request: filePath is required'
            })
        }
        const subBoard = await servicesSubboards.uploadSuboardImageService(subBoardId, filePath)
        return res.status(200).json({
            success: true,
            message: "Upload subboard image successfully",
            data: subBoard
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export default {
    addSubBoardToTask,
    updateSubBoardOnTask,
    deleteSubBoardOnTask,
    uploadSubBoardImage
}