const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Protect routes (Verify Token)
exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Fetch the full user from the DB so we know their role
            req.user = await User.findById(decoded.id);
            next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
    }
};

// 2. Grant access to specific roles (This is the missing function!)
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `User role '${req.user.role}' is not authorized to access this route` 
            });
        }
        next();
    };
};