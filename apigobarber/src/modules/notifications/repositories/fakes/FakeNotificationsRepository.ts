import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import { getMongoRepository, MongoRepository } from "typeorm";
import NotificationEntity from "@modules/notifications/infra/typeorm/schemas/Notification";
import { ObjectID } from "mongodb";

export default class FakeNotificationsRepository implements INotificationsRepository {

    private notifications: NotificationEntity[] = []

    async create({content, recipient_id}: ICreateNotificationDTO): Promise<NotificationEntity> {
        const notification = new NotificationEntity();

        Object.assign(notification, {id: new ObjectID(), content, recipient_id});

        this.notifications.push(notification);

        
        return notification;
    }

}