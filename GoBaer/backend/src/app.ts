import 'dotenv/config';
import * as Sentry from '@sentry/node';
import express from 'express';
import 'express-async-errors';
import path from 'path';
import Youch from 'youch';
import sentryConfig from './config/sentry';
import './database';
import routes from './routes';
import cors from 'cors';

class App {
    private _serve: express.Application;

    constructor() {
      this._serve = express();
      this.middlewares();
      
      Sentry.init(sentryConfig);
      this.routes();
      this.exceptionHandler();
    }

    get server(): express.Application {
      return this._serve;
    }

    middlewares(): void {
      this._serve.use(Sentry.Handlers.requestHandler());
      this._serve.use(cors());
      this._serve.use(express.json());
      this._serve.use('/files', express.static(path.resolve(__dirname, '..', 'tmp','uploads' )));
    }

    routes(): void {
      this._serve.use(routes);
      this._serve.use(Sentry.Handlers.errorHandler());
    }

    exceptionHandler() {
      this._serve.use(async(err, req, res, next) => {
          if(process.env.NODE_ENV === 'development'){
            const errors = await new Youch(err,req).toJSON();
            return res.status(500).json(errors);
          }
          return res.status(500).json({error: 'Internal server error'});
        }
      )
    }
}

export default new App().server;
