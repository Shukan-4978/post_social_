const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        // Get Authorization header
        const authHeader = req.header("Authorization");

        console.log("Authorization Header:", authHeader);

        // Check if header exists
        if (!authHeader) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        // Check if it starts with Bearer
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Invalid authorization format. Use 'Bearer <token>'."
            });
        }

        // Extract token
        const token = authHeader.split(" ")[1];

        console.log("Extracted Token:", token);

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded User:", decoded);

        // Attach user data to request
        req.user = decoded;

        next();
    } catch (err) {
        console.error("JWT Error:", err.message);

        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

module.exports = auth;