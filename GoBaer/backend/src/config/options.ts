import { Options } from "sequelize/types";

const configOptions: Options = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'docker',
    database: 'gobarber',
    define: {
        timestamps: true,
        underscored: true
    }
};

export default configOptions;