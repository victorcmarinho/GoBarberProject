import multer from "multer";
import cryto from "crypto";
import { extname, resolve} from 'path';

export default {
    storage: multer.diskStorage({
        destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
        filename: (req, file, callback) => {
            cryto.randomBytes(16, (err, res) => {
                if(err) return callback(err, file.originalname);

                return callback(null, res.toString('hex') + extname(file.originalname));
            });
        },
    }),
};