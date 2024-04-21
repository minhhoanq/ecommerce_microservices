import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

export class ResourceService {
    _prisma: PrismaClient;
    constructor() {
        this._prisma = new PrismaClient();
    }

    async CreateRource(name: string, slug: string, desc: string) {
        return await this._prisma.resource.create({
            data: {
                name: name,
                slug: slug,
                desc: desc,
            },
        });
    }
}
