import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class RegisterUser {
    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    sex: string;

    @IsNotEmpty()
    avatar: string;

    @IsNotEmpty()
    date_of_birth: string;
}

export class LoginUser {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
