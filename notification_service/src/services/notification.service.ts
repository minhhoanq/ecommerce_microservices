import { inject, injectable } from "inversify";
import "reflect-metadata";
// import { RPCRequest } from "../utils/rabbitmq";
import { INotificationService } from "../interfaces/services/notification.service.interface";
import { INotificationRepository } from "../database/repositories/notification.repo.interface";
import { TYPES } from "../types/type";
require("dotenv").config();

// const notiRepo = myContainer.get<INotificationRepository>(
//     TYPES.INotificationRepository
// );

@injectable()
export class NotificationService implements INotificationService {
    // static async createNotification(data: any) {
    //     console.log("data: ", data);
    //     const { type, senderId, content } = data;
    //     let receiverIds: any[] = [];
    //     const followers = (await RPCRequest(
    //         process.env.USER_FOLLOWERS_RPC || "",
    //         {
    //             event: "GET_SHOP_FOLLOWERS",
    //             data: {
    //                 shop_id: senderId,
    //             },
    //         }
    //     )) as any[];

    //     followers.map((follow) => receiverIds.push({ userId: follow.user_id }));
    //     console.log("receiverIds: ", receiverIds);
    //     return await createNotification(type, senderId, receiverIds, content);
    // }
    private _notiRepo: INotificationRepository;
    public constructor(
        @inject(TYPES.NotificationRepository)
        notiRepo: INotificationRepository
    ) {
        this._notiRepo = notiRepo;
    }
    public testConnection() {
        return this._notiRepo.testConnection();
        // return await notiRepo.testConnection();
    }

    static async SubscribeEvents(payload: any) {
        payload = JSON.parse(payload);
        const { event, data } = payload;
        console.log("payload: ", payload);
        switch (event) {
            case "CREATE_NOTIFICATION":
                // this.createNotification(data);
                break;

            default:
                break;
        }
    }
}
