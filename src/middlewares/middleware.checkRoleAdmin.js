import jwt from 'jsonwebtoken';
import Member from '../model/model.users.js';

// kiểm tra tài khoản đăng nhập có phải là admin hay không
export const checkRoleAdminMiddleware = async (req, res, next) => {
    // Lấy token từ header Authorization
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    try {
        // Giải mã token để lấy thông tin người dùng
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Tìm kiếm người dùng trong cơ sở dữ liệu
        const user = await Member.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Kiểm tra xem người dùng có phải là admin hay không
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. You do not have permission to perform this action.' });
        }

        // Nếu là admin, tiếp tục xử lý request
        next();
    } catch (error) {
        console.error('Error checking admin role:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}