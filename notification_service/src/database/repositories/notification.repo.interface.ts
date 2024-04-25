export interface INotificationRepository {
    testConnection(): any;
    createNotification(
        type: string,
        senderId: number,
        receiverIds: any[],
        content: string
    ): any;
}
