import Sequelize, { Model } from "sequelize";

export default class File extends Model<FileInterface> {
    id: string;
    name: string;
    path: string;

    static sequelize: Sequelize.Sequelize;
    static init(sequelize) {
        // @ts-ignore
        super.init(
            {
                name: Sequelize.STRING,
                path: Sequelize.STRING,
                url: {
                    type: Sequelize.VIRTUAL,
                    get() {
                        return `${process.env.APP_URL}/files/${this.path}`
                    }
                }
            },
            {
                sequelize
            }
        );
        
        return this;
    }

    getUserObject(): FileInterface {
        return {
            name : this.name,
            path: this.path
        }
    }

    static associate(){}
}

export interface FileInterface {
    id?: string,
    name: string,
    path: string,
    created_at?: Date,
    updated_at?: Date
}