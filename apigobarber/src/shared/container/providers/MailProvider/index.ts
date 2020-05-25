import EtherealMailProvider from './implementations/EtherealMailProvider';
import SESMailProvider from './implementations/SESMailProvider';
import { container } from 'tsyringe';
import mailConfig from '@config/mail';
import IMailProvider from './model/IMailProvider';

const providers = {
    ethereal: container.resolve(EtherealMailProvider),
    ses: container.resolve(SESMailProvider)
}

container.registerInstance<IMailProvider>(
    'MailProvider',
    providers[mailConfig.driver]
);