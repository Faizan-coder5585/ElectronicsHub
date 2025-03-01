const User = require('../models/User.js');
const { generateToken, verifyToken } = require('../config/jwt.js');
const sendEmail = require('../utils/emailService.js');

exports.userRegister = async (req, res) => {
    const { name, email, password,  confirmPassword,  } = req.body;

      // Validate required fields
      if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match.' });
    }


    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already registered.' });

        const user = new User({ name, email, password, otp, otpExpires: Date.now() + 10 * 60 * 1000 });
        await user.save();

        await sendEmail(email, 'Your OTP', `Your OTP is ${otp}`);
        res.status(201).json({ message: 'User registered. OTP sent to email.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.verifyOtp = async (req, res) => {
    const { otp } = req.body;

    try {
        // Find user by OTP
        const user = await User.findOne({ otp });
        if (!user) return res.status(400).json({ message: 'Invalid OTP.' });

        // Check if OTP is correct and hasn't expired
        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP.' });
        }

        if (user.otpExpires < Date.now()) {
            // OTP expired, resend a new one
            const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
            user.otp = newOtp;
            user.otpExpires = Date.now() + 10 * 60 * 1000;  // Set a new expiration time of 10 minutes

            await sendEmail(user.email, 'Your OTP', `Your new OTP is ${newOtp}`);
            await user.save();

            return res.status(400).json({ message: 'OTP expired. A new OTP has been sent to your email.' });
        }

        // Clear OTP and expiration time
        user.otp = null;
        user.otpExpires = null;

        // Set the user as verified
        user.verified = true;

        // Save the user document after updating the verification status
        await user.save();

        res.status(200).json({ message: 'OTP verified. Registration complete.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        // Generate new tokens
        const token = generateToken({ id: user._id }, '15m'); // Access token valid for 15 minutes
        const refreshToken = generateToken({ id: user._id }, '7d'); // Refresh token valid for 7 days

        // Clear old tokens and add the new refresh token
        user.tokens = [{ token: refreshToken }];
        await user.save();

        // Set the refresh token as an HTTP-only cookie
        res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

        // Return the new access token
        res.status(200).json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const { id } = req.params; // Extract user ID from the route parameter
        const user = await User.findById(id); // Find the user by ID

        if (!user) {
            return res.status(404).json({ error: 'User not found' }); // Handle case where user doesn't exist
        }

        res.status(200).json(user); // Return user data
    } catch (error) {
        res.status(500).json({ error: error.message }); // Handle errors
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const user = await User.findById(req.user.id); // Assuming `req.user` is populated after authentication
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const users = await User.find().select('-password -tokens -otp -otpExpires');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const user = await User.findById(req.user.id); // Assuming `req.user` is populated after authentication
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
        if (!updatedUser) return res.status(404).json({ message: 'User not found.' });

        res.status(200).json({ message: 'User updated successfully.', updatedUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try {
        if (refreshToken) {
            const user = await User.findOne({ 'tokens.token': refreshToken });
            if (user) {
                // Remove the refresh token from the database
                user.tokens = user.tokens.filter((t) => t.token !== refreshToken);
                await user.save();
            }
        }

        // Clear the cookie
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'Logged out successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Email not registered.' });

        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10-minute expiry
        await user.save();

        await sendEmail(email, 'Password Reset OTP', `Your OTP is ${otp}`);
        res.status(200).json({ message: 'OTP sent to email.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
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

exports.refreshToken = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    try {
        if (!refreshToken) return res.status(403).json({ message: 'Refresh token missing.' });

        const decoded = verifyToken(refreshToken);
        const user = await User.findOne({ _id: decoded.id, 'tokens.token': refreshToken });
        if (!user) return res.status(403).json({ message: 'Invalid refresh token.' });

        const newAccessToken = generateToken({ id: user._id }, '15m');
        res.status(200).json({ token: newAccessToken });
    } catch (err) {
        res.status(403).json({ message: 'Invalid or expired refresh token.' });
    }
};

exports.dashboard = async (req, res) => {
    try {
        // Example: Public data for the dashboard
        const stats = {
            totalUsers: await User.countDocuments(),
            adminUsers: await User.countDocuments({ role: "admin" }),
            regularUsers: await User.countDocuments({ role: "user" }),
        };

        res.status(200).json({
            message: 'Welcome to the dashboard.',
            stats,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
