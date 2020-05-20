import IMailProvider from "../model/IMailProvider";
import ISendMailDTO from "../dtos/ISendMailDTO";


export default class FakeMailProvider implements IMailProvider{

    private messages: ISendMailDTO[] = [];

    async sendMail(message: ISendMailDTO): Promise<void> {
        this.messages.push(message)
    }

}