import IMailTemplateProvider from "../models/IMailTemplateProvider";
import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";

export default class FakeMailTemplateProvider implements IMailTemplateProvider {

    async parse({file: template}: IParseMailTemplateDTO): Promise<string> {
        return template;
    }

}