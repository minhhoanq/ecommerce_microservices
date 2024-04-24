import { inject, injectable } from "inversify";
import "reflect-metadata";
import { setupChannel, subcribeMessage } from "../utils/rabbitmq";
import { INotification } from "../interfaces/notification.interface";
import { NotificationServiceHandlers } from "../proto/gen/NotificationService";
// import { TYPES, myContainer } from "../services/inversify.config";
import { INotificationService } from "../interfaces/services/notification.service.interface";
import { TYPES } from "../types/type";

// const notiService = myContainer.get<INotificationService>(
//     TYPES.INotificationService
// );

@injectable()
export class NotificationHandlerFactory implements INotification {
    constructor(
        @inject(TYPES.NotificationService)
        private readonly _NotiService: INotificationService
    ) {}
    //chu y async o duoi vi se bi loi khi call grpc
    public notificationHandlers(): NotificationServiceHandlers {
        // const channel = await setupChannel();
        // subcribeMessage(channel, NotificationService);
        const handler = {
            TestConnection: (_: any, callback: any) => {
                console.log("chcek 2");
                const get = this._NotiService.testConnection();
                // const get = notiService.testConnection();
                console.log(get);
                callback(null, "checheu");
            },
        };
        return handler;
    }
}
