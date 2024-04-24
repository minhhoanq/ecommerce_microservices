import { NotificationServiceHandlers } from "../proto/gen/NotificationService";

export interface INotification {
    notificationHandlers(): NotificationServiceHandlers;
}
