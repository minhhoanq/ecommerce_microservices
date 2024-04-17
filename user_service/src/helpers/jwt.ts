import JWT from "jsonwebtoken";

interface AccessTokenData {
    user_id: number;
    role_id: number;
    email: string;
}

interface RefreshTokenData {
    user_id: string;
    role_id: number;
    email: string;
}

export const decode_token = async (token: string, key: string) => {
    const decode_user = <AccessTokenData>await JWT.verify(token, key);
    return decode_user;
};