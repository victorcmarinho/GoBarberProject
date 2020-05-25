import uploadConfig from '@config/upload';
import aws, { S3 } from 'aws-sdk';
import fs from "fs";
import path from 'path';
import IStorageProvider from "../models/IStorageProvider";
import mime from 'mime';

export default class S3StorageProvider implements IStorageProvider{

    private client: S3;


    constructor() {
        this.client = new aws.S3({
            region: 'sa-east-1'
        })
    }
    
    async saveFile(file: string): Promise<string> {
        const originalPath = path.resolve(uploadConfig.tmpFolder, file);

        const ContentType = mime.getType(originalPath);

        if(!ContentType)
            throw new Error('File type not found')

        const fileContent = await fs.promises.readFile(originalPath);

        await this.client.putObject({
            Bucket: uploadConfig.config.aws.bucket,
            Key: file,
            ACL: "public-read",
            Body: fileContent,
            ContentType,
            ContentDisposition: `inline; filename=${file}`
        }).promise();

        await fs.promises.unlink(originalPath);
        
        return file;
    }
    
    async deleteFile(file: string): Promise<void> {
        await this.client.deleteObject({
            Bucket: uploadConfig.config.aws.bucket,
            Key: file
        }).promise();
    }

}