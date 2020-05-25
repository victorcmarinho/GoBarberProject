import fs from 'fs';
import handlebars from 'handlebars';
import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";
import IMailTemplateProvider from "../models/IMailTemplateProvider";


export default class HandlebarsMailTemplateProvider implements IMailTemplateProvider {

    async parse({file, variables}: IParseMailTemplateDTO): Promise<string> {
        const templateFileContent = await fs.promises.readFile(file, {encoding: 'utf-8'});
        const parseTemplate = handlebars.compile(templateFileContent);

        return parseTemplate(variables);
    }

}