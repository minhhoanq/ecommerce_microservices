import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateNotification {
    @IsNotEmpty()
    @IsString()
    type: string;

    @IsNotEmpty()
    @IsNumber()
    senderId: string;

    @IsNotEmpty()
    @IsArray()
    receiverIds: number[];

    @IsNotEmpty()
    @IsString()
    content: string;
}
