const dns = require('dns');

dns.setServers([
    '8.8.8.8',
    '1.1.1.1'
]);

require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static('public'));
app.use('/models', express.static('models'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected');
    })
    .catch((error) => {
        console.error('❌ MongoDB connection failed:', error.message);
    });

// User model
const User = mongoose.model('User', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    faceImage: String,
    password: {
        type: String,
        required: true
    },
    descriptor: {
        type: [Number],
        required: true
    }
}));


// Registration endpoint
app.post('/register', async (req, res) => {

    try {


        const {
            name,
            email,
            password,
            descriptor,
            faceImage
        } = req.body;

        // Validate face descriptor
        if (!descriptor || !Array.isArray(descriptor) || descriptor.length !== 128) {
            return res.status(400).json({ message: 'Invalid face data' });
        }

        // Validate face image is present (base64 string or URL)
        if (!faceImage) {
            return res.status(400).json({ message: 'faceImage is required' });
        }

        // Check existing email
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        await User.create({ name, email, password: hashedPassword, descriptor, faceImage });

        res.json({
            message: 'User registered successfully!'
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Registration failed'
        });
    }
});

// Face login endpoint
const FACE_DISTANCE_THRESHOLD = 0.6; // lower = stricter, adjust as needed

function euclideanDistance(a, b) {
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        const d = a[i] - b[i];
        sum += d * d;
    }
    return Math.sqrt(sum);
}

app.post('/login', async (req, res) => {
    try {
        const { email, password, descriptor, currentFaceImage } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        if (!descriptor || !Array.isArray(descriptor) || descriptor.length !== 128) {
            return res.status(400).json({ success: false, message: 'Invalid face descriptor' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`Login failed: no user for email=${email}`);
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log(`Login failed: password mismatch for email=${email}`);
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        // Compare face descriptor
        const stored = user.descriptor;
        if (!stored || stored.length !== 128) {
            console.log(`Login failed: user has no valid stored descriptor for email=${email}`);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        const distance = euclideanDistance(descriptor, stored);
        console.log(`Login attempt for ${email} — face distance: ${distance.toFixed(4)}`);

        if (distance > FACE_DISTANCE_THRESHOLD) {
            return res.status(401).json({ success: false, message: 'Face does not match' });
        }

        return res.json({
            success: true,
            message: 'Login successful',
            user: {
                name: user.name,
                email: user.email,
                faceImage: user.faceImage
            }
        });

    } catch (err) {
        console.error('Login error:', err && err.message);
        return res.status(500).json({ success: false, message: 'Login failed' });
    }
});

// Serve frontend root after API routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});