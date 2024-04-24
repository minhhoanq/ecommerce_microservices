import { injectable } from "inversify";
// import { INotificationRepository } from "./notification.repo.interface";
import { notification } from "../schemas/notification.schema";
import { INotificationRepository } from "./notification.repo.interface";
// import "reflect-metadata";
// export const createNotification = async (
//     type: string,
//     senderId: number,
//     receiverIds: any[],
//     content: string
// ) => {
//     console.log(receiverIds);
//     let msg;
//     if (type === "CREATE_PRODUCT") {
//         msg = `Shop ${senderId} : đã thêm sản phẩm mới vô của hàng \n Sản phẩm: ${content}`;
//     }

//     const newNotification = await notification.create({
//         type: type,
//         senderId: senderId,
//         receiverIds: receiverIds,
//         content: msg,
//         isRead: false,
//     });

//     return newNotification;
// };

@injectable()
export class NotificationRepository implements INotificationRepository {
    public async testConnection() {
        return "Method not implemented.";
    }
}
