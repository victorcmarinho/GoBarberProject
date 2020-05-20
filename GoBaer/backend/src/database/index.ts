
import  configOptions  from "../config/options"
import User from "../app/models/User";
import { Sequelize } from "sequelize";
import File from "../app/models/File";
import Appointment from "../app/models/Appointment";
import mongoose from "mongoose";

const models = [User, File, Appointment];
class Database {
    private connection: Sequelize;
    private mongoConnection: any;
    constructor(){
        this.init();
        this.mongo();
    }
    init(): void {
        this.connection = new Sequelize(configOptions);
        models
        .map(model => model.init(this.connection))
        .map(model => model.associate(this.connection.models) )
    }

    async mongo() {
        this.mongoConnection = mongoose.connect(
            process.env.MONGO_URL,
            {
                useNewUrlParser: true,
                useFindAndModify: true,
                useUnifiedTopology: true
            }
        );
    }
}

export default new Database();