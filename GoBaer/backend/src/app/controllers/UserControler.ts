import { ResponseViewModel } from "../shared/ViewModel";
import User from "../models/User";
import { Request, Response } from "express";
import * as Yup from "yup";

class UserControler {

    async store(req: Request, res: Response) {

        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6)
        });

        if(!(await schema.isValid(req.body))){
            return res.status(400).json(ResponseViewModel.createResponse({data: false,message: "Validation fails",status: 400}));
        }
        try {
            const userExist = await User.findOne({ where: { email: req.body.email } });
            if (userExist)
                return res.status(400).json(ResponseViewModel.createResponse({ status: 400, data: false, message: "Email já existe" }))

            const user = await User.create(req.body);
            return res.json(ResponseViewModel.createResponse({ data: true, message: `Usuário ${req?.body?.name} criado com sucesso`, status: 200 }));
        } catch (e) {
            return res.status(500).json(ResponseViewModel.createError(e));
        }
    }

    async update(req: Request, res: Response) {
        try {

            const schema = Yup.object().shape({
                name: Yup.string(),
                email: Yup.string().email(),
                old_password: Yup.string().min(6),
                password: Yup.string().min(6)
                    .when('old_password',(old_password, field) => 
                        old_password ? field.required() : field
                    ),
                confirmPassword: Yup.string()
                    .when('password', (password,field) =>
                        password ? field.required().oneOf([Yup.ref('password')]) : field
                )
            });
    
            if(!(await schema.isValid(req.body))){
                return res.status(400).json(ResponseViewModel.createResponse({data: false,message: "Validation fails",status: 400}));
            }

            const {email, old_password} = req.body;
            const user = await User.findByPk(req.userId)
            
            if(email !== user.email){
                const userExist = await User.findOne({ where: {email}});
                if(userExist)
                    return res.status(400).json(ResponseViewModel.createResponse({data: false, message: "User already exists.", status: 400}))
            }

            if(old_password &&!(await user.checkPassword(old_password)))
                return res.status(401).json(ResponseViewModel.createResponse({data: false, message: "Password does not match", status: 401}));
            
            const {id, name, provider} = await user.update(req.body);
            return res.json(ResponseViewModel.createResponse({data: {id, name, provider},message:"Usuário atualizado com sucesso", status: 200}))
        } catch (error) {
            return res.status(500).json(ResponseViewModel.createError(error));
        }
    }
}

export default new UserControler();