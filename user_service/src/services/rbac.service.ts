import { PrismaClient } from "@prisma/client";

export class RbacService {
    _prisma: PrismaClient;
    constructor() {
        this._prisma = new PrismaClient();
    }

    async createRoleResource(
        role_id: number,
        resource_id: number,
        action: string,
        attributes?: string
    ) {
        return await this._prisma.role_Resource.create({
            data: {
                role_id: role_id,
                resource_id: resource_id,
                action: action,
                attributes: attributes,
            },
        });
    }

    async getAccessList(role_id: number, resource: string) {
        // console.log(role_id, resource);
        const resourceResult = await this._prisma.resource.findFirst({
            where: {
                name: resource,
            },
        });
        const roleResult = await this._prisma.role.findFirst({
            where: {
                id: role_id,
            },
        });
        const resource_id = resourceResult?.id;
        const access: any[] = await this._prisma.role_Resource.findMany({
            include: {
                role: true,
                resource: true,
            },
            where: {
                role_id: role_id,
                resource_id: resource_id,
            },
        });
        const grantList: any[] = [];
        access.map((item) => {
            return grantList.push({
                role: item.role.name,
                resource: item.resource.name,
                action: item.action,
                attributes: item.attributes,
            });
        });

        // console.log(grantList);
        return { grantList: grantList, role_name: roleResult?.name };
    }
}
