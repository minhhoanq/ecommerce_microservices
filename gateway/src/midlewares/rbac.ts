import { NextFunction, Request, Response } from "express";
import { AccessControl, Permission, Query } from "accesscontrol";
import { promisify } from "util";
import { clientUser } from "../start_server_grpc";
import { client } from "../utils/redis";
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo3LCJyb2xlX2lkIjoyLCJlbWFpbCI6ImhvYW5nU2hvcEBnbWFpbC5jb20iLCJpYXQiOjE3MTM3MTM2MTUsImV4cCI6MTcxMzg4NjQxNX0.I_o58R1oFRIsEdW_wkKZmI73jF-2Qiz4htW9sy1Ua54
export const GrantAccess = (action: string, resource: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const getAccessListAsync = promisify(clientUser.GetAccess).bind(
                clientUser
            );
            const payload = {
                role_id: req.user.role_id,
                resource: resource,
            };
            let accessRedis: any = await client.get(
                `access:${req.user.user_id}`
            );
            console.log("check redis 222", accessRedis);
            let access: any;
            if (!accessRedis) {
                const accessDb = await getAccessListAsync(payload);
                console.log(accessDb);
                access = accessDb;
                await client.set(
                    `access:${req.user.user_id}`,
                    JSON.stringify(accessDb)
                );
            } else {
                access = await JSON.parse(accessRedis);
            }

            console.log("access redis", access);

            const ac = new AccessControl(access.grantList);
            const permissions = ac.can(access.role_name);
            const isPermitted = permissions[action as keyof typeof permissions](
                resource
            ) as Permission;

            // const permissions = ac.;
            console.log("check 3", isPermitted.granted);
            if (!isPermitted.granted) {
                return res.json("You dont have enough permissions");
            }
            next();
        } catch (error) {}
    };
};
