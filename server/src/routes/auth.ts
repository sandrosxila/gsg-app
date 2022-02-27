import express, { Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

import User from '../models/User';


const router = express.Router();

router.post('/register', [
    check('fullName', 'Full name should not be empty').isLength({ min: 1 }),
    check('username', 'Username should not be empty').isLength({ min: 1 }),
    check('username', 'Username should contain uppercase, lowercase characters or digits')
        .matches(/^[a-zA-Z0-9]+$/),
    check("password", "Password must be at least 8 chars long").isLength({ min: 8, }),
    check("password", "Password should contain uppercase, lowercase, special character and number")
        .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/),
], async (req: Request, res: Response) => {
    const { fullName, username, password } = req.body;

    // Validate user input
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    // Validate if user already exists
    const user = await User.findOne({ username }).exec();

    if (user) {
      // 422 Unprocessable Entity: server understands the content type of the request entity
      // 200 Ok: Gmail, Facebook, Amazon, Twitter are returning 200 for user already exists
      return res.status(200).json({
        errors: [
          {
            username: user.username,
            message: "The user already exists",
          },
        ],
      });
    }

    // Hash password before saving to database
    const salt = await bcrypt.genSalt(10);
    console.log("salt:", salt);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("hashed password:", hashedPassword);

    const newUser = new User({
        fullName,
        username,
        password: hashedPassword
    });

    newUser.save();

    res.json({
        message: 'User created successfully'
    });
});


let refreshTokens: string[] = [];

// Log in
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    // Look for user email in the database
    const user = await User.findOne({ username }).exec();

    // If user not found, send error message
    if (!user) {
        return res.status(400).json({
            errors: [
                {
                    message: "Couldn't find user with that username",
                },
            ],
        });
    }

    // Compare hashed password with user password to see if they are valid
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({
            errors: [
                {
                    message: "Password is invalid",
                },
            ],
        });
    }

    // Send JWT access token
    const accessToken = JWT.sign(
        { username },
        process.env.JWT_SECRET!,
        {
            expiresIn: "10m",
        }
    );

    const {exp} = JWT.decode(accessToken) as {exp: number};

    // Refresh token
    const refreshToken = JWT.sign(
        { username },
        process.env.REFRESH_JWT_SECRET!,
        {
            expiresIn: "24h",
        }
    );

    // Set refresh token in refreshTokens array
    refreshTokens.push(refreshToken);

    res.json({
        accessToken,
        expiresAt: exp,
        refreshToken,
    });
});


// Create new access token from refresh token
router.post("/token", async (req, res) => {
    const refreshToken = req.header("x-auth-token");

    // If token is not provided, send error message
    if (!refreshToken) {
        return res.status(401).json({
            errors: [
                {
                    message: "Token not found",
                },
            ],
        });
    }

    // If token does not exist, send error message
    if (!refreshTokens.includes(refreshToken)) {
        return res.status(403).json({
            errors: [
                {
                    message: "Invalid refresh token",
                },
            ],
        });
    }

    try {

        interface DecodedToken extends JWT.JwtPayload {
            username: string;
        }

        const { username } = JWT.verify(
            refreshToken,
            process.env.REFRESH_JWT_SECRET!
        ) as DecodedToken;

        const accessToken = JWT.sign(
            { username },
            process.env.JWT_SECRET!,
            { expiresIn: "10m" }
        );

        const {exp} = JWT.decode(accessToken) as {exp: number};

        res.json({ accessToken, expiresAt: exp });
    } catch (error) {

        console.log(error)

        res.status(403).json({
            errors: [
                {
                    message: "Invalid token",
                },
            ],
        });
    }
});

router.delete("/logout", (req, res) => {
    const refreshToken = req.header("x-auth-token");

    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    res.sendStatus(204);
});

export default router;