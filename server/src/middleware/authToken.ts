import JWT from 'jsonwebtoken';
import {JwtPayload, Jwt} from 'jsonwebtoken';
import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
dotenv.config();

export interface IGetUserAuthInfoRequest extends Request {
    user: Jwt | JwtPayload | string; 
}

const authToken = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    const token = req.header("x-auth-token");

    if (!token) {
        res.status(401).json({
            errors: [{ msg: "Access denied. No token provided." }]
        });
    }

    try {
        const user = JWT.verify(token!, process.env.JWT_SECRET!);
        req.user = user;
        next();
    } 
    catch (err) {
        res.status(403).json({
            errors: [{ msg: "Invalid Token" }]
        });
    }
}