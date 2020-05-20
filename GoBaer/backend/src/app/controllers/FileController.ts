import File from '../models/File';
import { Response, Request } from 'express';

class FileController {
    async store(req: Request, res: Response) {
        const { originalname: name, filename: path } = req.file;
        const file = await File.create({
            name,
            path
        });
        return res.json(file);
    }
}

export default new FileController();