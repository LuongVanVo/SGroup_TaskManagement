import Member from '../model/model.users.js'
export const checkEmailExist = async (req, res, next) => {
    const { email } = req.body
    const member = await Member.findOne({ email })
    if (member) {
        return res.status(400).json({
            success: false,
            message: 'Email already exists'
        })
    }
    next()
}