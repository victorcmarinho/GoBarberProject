import uploadConfig from '@config/upload';
import 'dotenv/config'
import AppError from '@shared/errors/AppErros';
import '@shared/infra/typeorm';
import '@shared/container';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import 'reflect-metadata';
import routes from './routes';
import { errors } from 'celebrate';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);
app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
    if(err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'Error',
            message: err.message
        });
    }

    console.error(err);
    
    return response.status(500).json({
        status: 'error',
        message: 'Internal Server Error!'
    });
});

app.listen(3333, () => {
    console.log('🚀 Server started on http://localhost:3333  ');
});
