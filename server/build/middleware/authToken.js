"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authToken = (req, res, next) => {
    const token = req.header("x-auth-token");
    if (!token) {
        res.status(401).json({
            errors: [{ msg: "Access denied. No token provided." }]
        });
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = user;
        next();
    }
    catch (err) {
        res.status(403).json({
            errors: [{ msg: "Invalid Token" }]
        });
    }
};
