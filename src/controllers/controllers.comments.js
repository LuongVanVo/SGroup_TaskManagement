import servicesComments from '../services/services.comments.js';

const addCommentToTask = async (req, res) => {
    try {
        const { taskId } = req.params; 
        const { content } = req.body;

        // Quan trọng: Lấy userId từ thông tin người dùng đã đăng nhập (ví dụ: req.member)
        // Middleware xác thực của bạn nên gán thông tin user (bao gồm id) vào req.member hoặc req.user
        if (!req.member || !req.member.id) { // KIỂM TRA KỸ BƯỚC NÀY
            return res.status(401).json({
                success: false,
                message: 'Unauthorized: User information not found. Please login.'
            });
        }
        const userId = req.member.id; // Lấy userId từ đây

        if (!taskId) {
            return res.status(400).json({
                success: false,
                message: 'Bad Request: taskId is required in URL parameters.'
            });
        }
        if (!content) {
            return res.status(400).json({
                success: false,
                message: 'Bad Request: content is required in the request body.'
            });
        }

        const commentData = {
            content: content,
            userId: userId
        };

        const newComment = await servicesComments.addCommentToTaskService(taskId, commentData);
        
        return res.status(201).json({
            success: true,
            message: "Comment added successfully to task",
            data: newComment
        });
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// get all comments of a task
const getAllCommentsOfATask = async (req, res) => {
    try {
        const { taskId } = req.params
        const comments = await servicesComments.getAllCommentsOfATaskService(taskId)
        return res.status(200).json({
            success: true,
            message: "All comments of a task",
            data: comments
        })
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}
export default {
    addCommentToTask,
    getAllCommentsOfATask
}
