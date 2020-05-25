import uploadConfig from '@config/upload';
import aws, { S3 } from 'aws-sdk';
import fs from "fs";
import path from 'path';
import IStorageProvider from "../models/IStorageProvider";

export default class S3StorageProvider implements IStorageProvider{

    private client: S3;


    constructor() {
        this.client = new aws.S3({
            region: 'sa-east-1'
        })
    }
    
    async saveFile(file: string): Promise<string> {
        const originalPath = path.resolve(uploadConfig.tmpFolder, file);

        const fileContent = await fs.promises.readFile(originalPath, {
            encoding: 'utf-8'
        });

        await this.client.putObject({
            Bucket: 'bucketappgobarber',
            Key: file,
            ACL: "public-read",
            Body: fileContent
        }).promise();

        return file;
    }
    
    async deleteFile(file: string): Promise<void> {
        await this.client.deleteObject({
            Bucket: 'bucketappgobarber',
            Key: file
        }).promise();
    }

}