import { Container } from "inversify";
import { TYPES } from "../types/type";
import { INotification } from "../interfaces/notification.interface";
import { NotificationHandlerFactory } from "../handlers/notification.handler";
import { INotificationService } from "../interfaces/services/notification.service.interface";
import { NotificationService } from "../services/notification.service";
import { INotificationRepository } from "../database/repositories/notification.repo.interface";
import { NotificationRepository } from "../database/repositories/notification.repo";

const container = new Container();
container.bind(TYPES.NotificationHandlerFactory).to(NotificationHandlerFactory);
container
    .bind<INotificationService>(TYPES.NotificationService)
    .to(NotificationService);
container
    .bind<INotificationRepository>(TYPES.NotificationRepository)
    .to(NotificationRepository);
export { container };
