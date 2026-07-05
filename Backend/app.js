const express = require("express")
const dotenv = require('dotenv')
const cors = require('cors')
const mongoose = require("mongoose");
const userRouter = require('./routes/userRoutes.js')
const path = require('path')
const postRouter = require('./routes/postRoutes.js')

dotenv.config();

const app = express();

// Middlewares
const allowedOrigins = [
    "http://localhost:5173",
    "https://basic-post-social-froentend.vercel.app",
    "https://post-social-iota.vercel.app"
];

if (process.env.FRONTEND_URL) {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// Upload folder 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// For test
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

// Test routes
app.get('/', (req, res) => {
    res.json({ message: 'PostSocial API is running successfully!' });
});

app.get('/api', (req, res) => {
    res.json({ message: 'PostSocial API endpoint is active!' });
});

// Error handling middleware
const multer = require('multer');
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ message: 'Image is too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error', error: err.message });
});

const PORT = process.env.PORT || 5000;

// Start server FIRST
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Connect MongoDB separately
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((error) => {
        console.error("MongoDB Connection Error:", error);
    });