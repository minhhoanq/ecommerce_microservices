import { PrismaClient } from "@prisma/client";

export class RoleService {
    _prima: PrismaClient;
    constructor() {
        this._prima = new PrismaClient();
    }

    async createRole(name: string) {
        return await this._prima.role.create({
            data: {
                name: name,
            },
        });
    }
}
