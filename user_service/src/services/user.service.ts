import { PrismaClient } from "@prisma/client";
import { LoginUser, RegisterUser } from "../dto/user.dto";
import { IUserRepo } from "../interfaces/user.repo.interface";
import bcrypt from "bcrypt";
import crypto from "crypto";
import JWT from "jsonwebtoken";

export class UserService {
    private _repo: IUserRepo;
    _prisma: PrismaClient;
    constructor(repository: IUserRepo) {
        this._repo = repository;
        this._prisma = new PrismaClient();
    }

    async hasdData(data: any) {
        return await bcrypt.hash(data, 10);
    }

    async validateData(input: any, data: any) {
        return await bcrypt.compare(input, data);
    }

    async createTokenPair(
        user_id: number,
        role_id: number,
        email: string,
        public_key: string,
        private_key: string
    ) {
        const payload = { user_id, role_id, email };
        const access_token = await JWT.sign(payload, public_key, {
            expiresIn: "2 days",
        });

        const refresh_token = await JWT.sign(payload, private_key, {
            expiresIn: "7 days",
        });

        return {
            access_token,
            refresh_token,
        };
    }

    async register(data: RegisterUser, client_ip: any, client_agent: any) {
        console.log(data);
        const {
            email,
            password,
            first_name,
            last_name,
            sex,
            avatar,
            date_of_birth,
        } = data;
        const userExists = await this._prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (userExists) {
            throw new Error("User already exists");
        }
        const hashedPassword = await this.hasdData(password);
        const newUser = await this._prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                first_name: first_name,
                last_name: last_name,
                sex: sex,
                avatar: avatar,
                date_of_birth: date_of_birth,
            },
        });

        if (newUser) {
            const public_key = crypto.randomBytes(64).toString("hex");
            const private_key = crypto.randomBytes(64).toString("hex");

            const tokens = await this.createTokenPair(
                newUser.id,
                newUser.role_id,
                newUser.email,
                public_key,
                private_key
            );

            const session = await this._prisma.session.create({
                data: {
                    email: newUser.email,
                    public_key: public_key,
                    private_key: private_key,
                    client_agent: client_agent,
                    client_ip: client_ip,
                    expired_at: 604800,
                    refresh_token: tokens.refresh_token,
                },
            });

            if (!session) {
                throw new Error("Unable to create session");
            }

            return {
                user: {
                    id: newUser.id,
                    email: newUser.email,
                },
                tokens,
            };
        }

        return null;
    }

    async login(user: LoginUser, client_ip: any, client_agent: any) {
        const userExists = await this._prisma.user.findUnique({
            where: {
                email: user.email,
            },
        });

        if (!userExists) {
            throw new Error("User already exists");
        }
        const match = await this.validateData(
            user.password,
            userExists.password
        );
        if (!match) throw new Error("Invalid password!");

        const public_key = crypto.randomBytes(64).toString("hex");
        const private_key = crypto.randomBytes(64).toString("hex");

        const tokens = await this.createTokenPair(
            userExists.id,
            userExists.role_id,
            userExists.email,
            public_key,
            private_key
        );

        const sessionExists = await this._prisma.session.findFirst({
            where: {
                email: userExists.email,
                client_agent: client_agent,
                client_ip: client_ip,
            },
        });
        let session;
        if (sessionExists) {
            session = await this._prisma.session.update({
                where: {
                    id: sessionExists.id,
                },
                data: {
                    public_key: public_key,
                    private_key: private_key,
                    expired_at: 604800,
                    refresh_token: tokens.refresh_token,
                },
            });
        } else {
            session = await this._prisma.session.create({
                data: {
                    email: userExists.email,
                    public_key: public_key,
                    private_key: private_key,
                    client_agent: client_agent,
                    client_ip: client_ip,
                    expired_at: 604800,
                    refresh_token: tokens.refresh_token,
                },
            });
        }

        if (!session) throw new Error("Error: session");

        return {
            user: {
                id: userExists.id,
                email: userExists.email,
            },
            tokens,
        };
    }

    async logout(session: any) {
        const delSession = await this._prisma.session.delete({
            where: {
                id: session.id,
            },
        });
        if (delSession) {
            return true;
        }
        return false;
    }

    async refreshToken(
        user: any,
        refresh_token: string,
        session: any,
        client_agent: any,
        client_ip: any
    ) {
        const { user_id, email, role_id } = user;
        // console.log(session);
        if (session.refresh_token !== refresh_token) {
            throw new Error("Invalid refresh token!");
        }

        const userExists = await this._prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        if (!userExists) throw new Error("User not registered");
        const tokens = await this.createTokenPair(
            user_id,
            role_id,
            email,
            session.public_key,
            session.private_key
        );

        const sessionExists = await this._prisma.session.findFirst({
            where: {
                email: userExists.email,
                client_agent: client_agent,
                client_ip: client_ip,
            },
        });

        await this._prisma.session.update({
            where: {
                id: sessionExists?.id,
            },
            data: {
                expired_at: 604800,
                refresh_token: tokens.refresh_token,
            },
        });

        const result = {
            user_id: userExists.id,
            email: userExists.email,
        };

        return {
            user: result,
            tokens,
        };
    }

    async getUsers() {
        return await this._prisma.user.findFirst({
            where: {
                email: "hoang@gmail.com",
            },
        });
    }

    async getSessionUser(
        email: string,
        client_agent: any,
        client_ip: any
    ): Promise<any> {
        return await this._prisma.session.findFirst({
            where: {
                email: email,
                client_agent: client_agent,
                client_ip: client_ip,
            },
        });
    }
}
