import ICreateNotificationDTO from "../dtos/ICreateNotificationDTO";
import NotificationEntity from "../infra/typeorm/schemas/Notification";

export default interface INotificationsRepository {
    create(data: ICreateNotificationDTO): Promise<NotificationEntity>
}