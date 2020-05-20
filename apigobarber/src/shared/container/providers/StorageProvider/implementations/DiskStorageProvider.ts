import IStorageProvider from "../models/IStorageProvider";
import fs from "fs";
import path from 'path';
import uploadConfig from '@config/upload';

export default class DiskStorageProvider implements IStorageProvider{
    async saveFile(file: string): Promise<string> {
        await fs.promises.rename(
            path.resolve(uploadConfig.tmpFolder, file),
            path.resolve(uploadConfig.uploadsFolder, file),
        );
        return file;
    }
    async deleteFile(file: string): Promise<void> {
        const filePath = path.resolve(uploadConfig.uploadsFolder, file);

        try {
            await fs.promises.stat(filePath);
        } catch (err) {
            return;
        }

        await fs.promises.unlink(filePath);
    }

}