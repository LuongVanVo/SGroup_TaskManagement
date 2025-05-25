// kiểm tra thời gian đến hạn với thời gian hiện tại
export const checkDueTimeMiddleware = (req, res, next) => {
    const { dueTime } = req.body
    const currentTime = new Date().toISOString()
    if (new Date(dueTime) < new Date(currentTime)) {
        return res.status(400).json({
            success: false,
            message: 'Due time must be greater than current time'
        })
    }
    next()
}