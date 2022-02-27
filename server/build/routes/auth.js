"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.post('/signup', [
    (0, express_validator_1.check)('fullName', 'Full name should not be empty').isLength({ min: 1 }),
    (0, express_validator_1.check)('username', 'Username should not be empty').isLength({ min: 1 }),
    (0, express_validator_1.check)('username', 'Username should contain uppercase, lowercase characters or digits')
        .matches(/^[a-zA-Z0-9]+$/),
    (0, express_validator_1.check)("password", "Password must be at least 8 chars long").isLength({ min: 8, }),
    (0, express_validator_1.check)("password", "Password should contain uppercase, lowercase, special character and number")
        .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fullname, username, password } = req.body;
    // Validate user input
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }
    // Validate if user already exists
    // let user = users.find((user) => {
    //   return user.email === email;
    // });
    // if (user) {
    //   // 422 Unprocessable Entity: server understands the content type of the request entity
    //   // 200 Ok: Gmail, Facebook, Amazon, Twitter are returning 200 for user already exists
    //   return res.status(200).json({
    //     errors: [
    //       {
    //         email: user.email,
    //         msg: "The user already exists",
    //       },
    //     ],
    //   });
    // }
    // Hash password before saving to database
    const salt = yield bcrypt_1.default.genSalt(10);
    console.log("salt:", salt);
    const hashedPassword = yield bcrypt_1.default.hash(password, salt);
    console.log("hashed password:", hashedPassword);
    // // Save email and password to database/array
    // users.push({
    //   email,
    //   password: hashedPassword,
    // });
    // Do not include sensitive information in JWT
    const accessToken = jsonwebtoken_1.default.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "1m",
    });
    res.json({
        accessToken,
    });
}));
// Log in
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    // Look for user email in the database
    // let user = users.find((user) => {
    //     return user.email === email;
    // });
    // If user not found, send error message
    // if (!user) {
    //     return res.status(400).json({
    //         errors: [
    //             {
    //                 msg: "Invalid credentials",
    //             },
    //         ],
    //     });
    // }
    // Compare hashed password with user password to see if they are valid
    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //     return res.status(401).json({
    //         errors: [
    //             {
    //                 msg: "Email or password is invalid",
    //             },
    //         ],
    //     });
    // }
    // Send JWT access token
    const accessToken = jsonwebtoken_1.default.sign({ username }, process.env.JWT_SECRET, {
        expiresIn: "1m",
    });
    // Refresh token
    const refreshToken = jsonwebtoken_1.default.sign({ username }, process.env.REFRESH_JWT_SECRET, {
        expiresIn: "5m",
    });
    // Set refersh token in refreshTokens array
    // refreshTokens.push(refreshToken);
    res.json({
        accessToken,
        refreshToken,
    });
}));
// let refreshTokens = [];
// Create new access token from refresh token
router.post("/token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.header("x-auth-token");
    // If token is not provided, send error message
    if (!refreshToken) {
        res.status(401).json({
            errors: [
                {
                    msg: "Token not found",
                },
            ],
        });
    }
    // If token does not exist, send error message
    // if (!refreshTokens.includes(refreshToken)) {
    //     res.status(403).json({
    //         errors: [
    //             {
    //                 msg: "Invalid refresh token",
    //             },
    //         ],
    //     });
    // }
    try {
        const user = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
        console.log(user);
        // user = { email: 'jame@gmail.com', iat: 1633586290, exp: 1633586350 }
        const { username } = user;
        const accessToken = jsonwebtoken_1.default.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1m" });
        res.json({ accessToken });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({
            errors: [
                {
                    msg: "Invalid token",
                },
            ],
        });
    }
}));
exports.default = router;
