import ShowProfileService from "@modules/users/services/ShowProfileService";
import UpdateProfileService from "@modules/users/services/UpdateProfileService";
import { classToClass } from "class-transformer";
import { Request, Response } from "express";
import { container } from "tsyringe";


export default class ProfileController {

    public async show(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;
        const showProfileService = container.resolve(ShowProfileService);

        const user = await showProfileService.execute({user_id});

        return response.json(user);
    }

    public async update(request: Request, response: Response): Promise<Response> {
        const user_id = request.user.id;
        const { name, email, password, old_password } = request.body;
        const createUser = container.resolve(UpdateProfileService);
    
        const user = await createUser.execute({ name, email, password, old_password, user_id });
    
        return response.json(classToClass(user));
    }
}