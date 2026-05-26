const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
exports.registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide all fields' });
        }

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide an email and password' });
        }

        // Check for user (must explicitly select password since it's hidden in schema)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate Token
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            token: token
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        // req.user is populated by the authMiddleware
        const user = await User.findById(req.user.id);
        
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// @desc    Get all users (ADMIN ONLY)
// @route   GET /api/auth/users
exports.getAllUsers = async (req, res) => {
    try {
        // Find all users in the database
        const users = await User.find({});
        
        res.status(200).json({ 
            success: true, 
            count: users.length,
            data: users 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};