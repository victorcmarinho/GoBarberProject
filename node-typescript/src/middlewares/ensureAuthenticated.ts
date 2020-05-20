import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import auth from "../config/auth";
import AppError from "../errors/AppErros";

interface ITokenPayload {
    iat: number;
    exp: number;
    sub: string;
}
export default function ensureAuthenticated(request: Request, response: Response, next: NextFunction): void {

    const authHeader = request.headers.authorization;

    if(!authHeader)
        throw new AppError('JWT token is missing', 401);
    const [,token] = authHeader.split(' ');

    try {
        const decoded = verify(token, auth.jwt.secret);
        const {sub} = <ITokenPayload>decoded;
        request.user = {
            id: sub
        };
        return next();
    } catch {
        throw new AppError('Invalid JWT token', 401);
    }


}