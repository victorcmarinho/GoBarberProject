import ICreateNotificationDTO from "@modules/notifications/dtos/ICreateNotificationDTO";
import INotificationsRepository from "@modules/notifications/repositories/INotificationsRepository";
import { getMongoRepository, MongoRepository } from "typeorm";
import NotificationEntity from "../schemas/Notification";

export default class NotificationsRepository implements INotificationsRepository {

    private ormRepository: MongoRepository<NotificationEntity>;

    constructor() {
        this.ormRepository = getMongoRepository(NotificationEntity, 'mongo');
    }

    async create({content, recipient_id}: ICreateNotificationDTO): Promise<NotificationEntity> {
        const notification = this.ormRepository.create({
            content,
            recipient_id
        });

        await this.ormRepository.save(notification);

        return notification;
    }

}