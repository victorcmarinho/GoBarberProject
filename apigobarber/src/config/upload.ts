import crypto from 'crypto';
import multer, { StorageEngine } from "multer";
import path from 'path';

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp');

interface IUploadConfig {
    driver: 's3' | 'disk';
    tmpFolder: string;
    uploadsFolder: string;

    multer: {
        storage: StorageEngine;
    },

    config: {
        disk: {};
        aws: {
            bucket: string
        }
    };
}


export default {
    
    driver: process.env.STORAGE_DRIVER,

    tmpFolder: tmpFolder,
    uploadsFolder: path.resolve(tmpFolder, 'uploads'),


    multer: {
        storage: multer.diskStorage({
            destination: tmpFolder,
            filename(request, file, callback) {
                const fileHash = crypto.randomBytes(10).toString('hex');
                const fileName = `${fileHash}-${file.originalname}`;

                return callback(null, fileName);
            }
        })
    },

    config: {
        disk: {},
        aws: {
            bucket: 'bucketappgobarber'
        }
    }

} as IUploadConfig;
