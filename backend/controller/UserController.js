const UserModel = require('../models/User.js');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../config/jwt.js');
const sendEmail = require('../utils/emailService.js');

// REGISTER
exports.userRegister = async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const userExists = await UserModel.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already registered.' });

        const user = new UserModel({ name, email, password, otp, otpExpires: Date.now() + 10 * 60 * 1000 });
        await user.save();

        await sendEmail(email, 'Your OTP', `Your OTP is ${otp}`);
        res.status(201).json({ message: 'User registered. OTP sent to email.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// VERIFY OTP
exports.verifyOtp = async (req, res) => {
    const { otp } = req.body;

    try {
        const user = await UserModel.findOne({ otp });
        if (!user) return res.status(400).json({ message: 'Invalid OTP.' });

        if (user.otpExpires < Date.now()) {
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = newOtp;
            user.otpExpires = Date.now() + 10 * 60 * 1000;
            await sendEmail(user.email, 'Your OTP', `Your new OTP is ${newOtp}`);
            await user.save();
            return res.status(400).json({ message: 'OTP expired. A new OTP has been sent to your email.' });
        }

        user.otp = null;
        user.otpExpires = null;
        user.isVerified = true;

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.status(200).json({
            message: 'OTP verified. Registration complete.',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
            token,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        const token = generateToken({ id: user._id }, '15m');
        const refreshToken = generateToken({ id: user._id }, '7d');

        user.tokens = [{ token: refreshToken }];
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET USER BY ID
exports.getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// GET ALL USERS (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const users = await UserModel.find().select('-password -tokens -otp -otpExpires');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE USER (Admin only)
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const user = await UserModel.findById(req.user.id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const updatedUser = await UserModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found.' });

        res.status(200).json({ message: 'User updated successfully.', updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGOUT
exports.logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try {
        if (refreshToken) {
            const user = await UserModel.findOne({ 'tokens.token': refreshToken });
            if (user) {
                user.tokens = user.tokens.filter((t) => t.token !== refreshToken);
                await user.save();
            }
        }

        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logged out successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Email not registered.' });

        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000;
        await user.save();

        await sendEmail(email, 'Password Reset OTP', `Your OTP is ${otp}`);
        res.status(200).json({ message: 'OTP sent to email.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await UserModel.findOne({ email });
        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        user.password = newPassword;
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// REFRESH TOKEN
exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token provided.' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const token = generateToken({ id: decoded.id }, '15m');

        res.status(200).json({ token });
    } catch (err) {
        res.status(401).json({ message: 'Invalid or expired refresh token.' });
    }
};

// DASHBOARD
exports.dashboard = async (req, res) => {
    try {
        const stats = {
            totalUsers: await UserModel.countDocuments(),
            adminUsers: await UserModel.countDocuments({ role: "admin" }),
            regularUsers: await UserModel.countDocuments({ role: "user" }),
        };

        res.status(200).json({
            message: 'Welcome to the dashboard.',
            stats,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
