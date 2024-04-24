import { NextFunction, Request, Response } from "express";
import { clientUser } from "../start_server_grpc";
// import JWT from "jsonwebtoken";
// import { asyncHandler } from "../helpers/asyncHandler";
// import { promisifyGRPCCall } from "../utils/grpc";
import { promisify } from "util";
import { AuthFailureError } from "../core/error.resoponse";

const HEADER = {
    API_KEY: "x-api-key",
    CLIENT_ID: "x-client-id",
    CLIENT_EMAIL: "x-client-email",
    AUTHORIZATION: "authorization",
    REFRESHTOKEN: "x-rtoken",
};

export interface AccessTokenData {
    user_id: number;
    role_id: number;
    email: string;
}

export interface RefreshTokenData {
    user_id: string;
    role_id: number;
    email: string;
}

export class auth {
    constructor() {}

    authentication = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const user_email = req.headers[HEADER.CLIENT_EMAIL] as string;
        const client_agent = req.headers["user-agent"];
        const client_ip = req.ip;

        if (!user_email)
            return res.json(new AuthFailureError(`Invalid client`));

        const payload = {
            email: user_email,
            client_agent: client_agent,
            client_ip: client_ip,
        };

        console.log("payload", payload);

        const getSessionUserAsync = promisify(clientUser.GetSessionUser).bind(
            clientUser
        );

        const session = await getSessionUserAsync(payload);

        console.log(session);

        if (!session) return res.json(new Error(`Not found session`));

        if (req.headers[HEADER.REFRESHTOKEN]) {
            const refresh_token = req.get(HEADER.REFRESHTOKEN) as string;
            try {
                const decodeTokenAsync = promisify(clientUser.DecodeToken).bind(
                    clientUser
                );
                const payloadToken = {
                    token: refresh_token,
                    key: session.private_key,
                };
                const decode_user = await decodeTokenAsync(payloadToken);

                if (user_email !== decode_user.email) {
                    return res.json(new Error("Invalid user_email"));
                }
                req.session = session;
                req.user = decode_user;
                req.refresh_token = refresh_token as string;
                return next();
            } catch (error) {
                return res.json(new Error("error"));
            }
        }

        const access_token = req.headers[HEADER.AUTHORIZATION] as string;
        if (!access_token) {
            return res.json(new Error("Access token not found"));
        }
        try {
            const decodeTokenAsync = promisify(clientUser.DecodeToken).bind(
                clientUser
            );
            const payloadToken = {
                token: access_token,
                key: session.public_key,
            };
            const decode_user = await decodeTokenAsync(payloadToken);

            if (user_email !== decode_user.email)
                return res.json(new Error("user_email not found"));
            req.session = session;
            req.user = decode_user;

            return next();
        } catch (error) {
            return res.json(new Error("error"));
        }
    };
}
