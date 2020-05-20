import { Request, Response } from "express";
import User from "../models/User";
import File from "../models/File";

import { ResponseViewModel } from "../shared/ViewModel";
import jwt from "jsonwebtoken";
import { env } from "../../enviroments/env";
import * as Yup from "yup";

class SessionController {
    async store(req: Request, res: Response) {
        const schema = Yup.object().shape({
            email: Yup.string().email().required(),
            password: Yup.string().required()
        });

        if(!(await schema.isValid(req.body))){
            return res.status(400).json(ResponseViewModel.createResponse({data: false,message: "Validation fails",status: 400}));
        }
        const { email, password } = req.body;
        const user = await User.findOne({ 
            where: { email } ,
            include: [
                {
                    model: File,
                    as: 'avatar',
                    attributes: ['id', 'path', 'url']
                }
            ]
        });
        if (!user)
            return res.status(401).json(ResponseViewModel.createResponse({ status: 401, data: false, message: "User not found" }));
        if (!await user.checkPassword(password))
            return res.status(401).json(ResponseViewModel.createResponse({ status: 401, data: false, message: "Password does not match" }));
        const { id, name, avatar } = user;
        return res.json(ResponseViewModel.createResponse({
            status: 200,
            data: {
                id,
                name,
                email,
                avatar,
                token: jwt.sign({ id }, env.jwtToken, { expiresIn: env.expiresIn })
            },
            message: "Sucess Login"
        }))
    }
}

export default new SessionController();