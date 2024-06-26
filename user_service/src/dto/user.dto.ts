import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsNumber,
    IsString,
} from "class-validator";

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

    @IsNumber()
    role_id?: number;
}

export class LoginUser {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class SessionUser {
    @IsNotEmpty()
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    refresh_token: string;

    @IsNotEmpty()
    @IsString()
    client_ip: string;

    @IsNotEmpty()
    @IsString()
    client_agent: string;

    @IsNotEmpty()
    // @IsBoolean()
    is_block: string;

    @IsNotEmpty()
    @IsString()
    private_key: string;

    @IsNotEmpty()
    @IsString()
    public_key: string;

    @IsNotEmpty()
    // @IsNumber()
    expired_at: string;
}
