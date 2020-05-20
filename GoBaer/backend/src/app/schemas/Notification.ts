import mongoose, { SchemaDefinition, SchemaOptions, Schema } from "mongoose";

const schemaDefinition: SchemaDefinition = {
    content: {
        type: String,
        required: true
    },
    user: {
        type: Number,
        required: true
    },
    read: {
        type: Boolean,
        required: true,
        default: false
    }
};

const schemaOptions: SchemaOptions = {
    timestamps: true
}

const notificationSchema: Schema = new mongoose.Schema(schemaDefinition,schemaOptions )


export default mongoose.model('Notification', notificationSchema);