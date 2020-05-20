import { Request, Response, NextFunction } from "express";
import { ResponseViewModel } from "../shared/ViewModel";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { env } from "../../enviroments/env";

export default async (req: Request, res: Response, next: NextFunction) =>  {
    const authHeader = req?.headers?.authorization;

    if(!authHeader)
        return res.status(401).json(ResponseViewModel.createResponse({data: false, message: "Token not provided", status: 401}));

    const [,token] = authHeader.split(" ");


    try {
        // @ts-ignore
        const decoded =await promisify(jwt.verify)(token,env.jwtToken);
        req.userId = decoded.id;
        return next();
    } catch (error) {
        return res.status(401).json(ResponseViewModel.createResponse({data: false, message: "Token invalid", status: 401}));
    }

}