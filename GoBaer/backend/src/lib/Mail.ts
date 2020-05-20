
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import exphbs from 'express-handlebars';
import nodemailerhbs from 'nodemailer-express-handlebars';
import { resolve } from 'path';

import mailConfig from '../config/mail';

class Mail {
    transporter: any;
    constructor() {
        const { auth } = mailConfig;
        this.transporter = nodemailer.createTransport({
            ...mailConfig,
            ...{ auth: auth.user ? auth : null },
        });
        this.configureTemplates();
    }

    async sendMail(message) {
        return await this.transporter.sendMail({
            ...mailConfig.default,
            ...message
        });
    }

    configureTemplates() {
        const viewPath = resolve(__dirname, '..', 'app', 'views', 'emails');
        this.transporter.use('compile',nodemailerhbs({
            viewEngine: exphbs.create({
                layoutsDir: resolve(viewPath, 'layouts'),
                partialsDir: resolve(viewPath, 'partials'),
                defaultLayout: 'default',
                extname: '.hbs',
            }),
            viewPath,
            extName: '.hbs',
        }));
    }

}
export default new Mail();