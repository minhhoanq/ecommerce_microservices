import { NextFunction, Request, Response } from "express";
import { AccessControl, Permission, Query } from "accesscontrol";
import { promisify } from "util";
import { clientUser } from "../start_server_grpc";

export const GrantAccess = (action: string, resource: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const getAccessListAsync = promisify(clientUser.GetAccess).bind(
                clientUser
            );
            console.log("check 1", action);
            const payload = {
                role_id: 1,
                resource: resource,
            };
            const access = await getAccessListAsync(payload);
            // ac.setGrants();
            // console.log("get access list", access);
            const role_name = req.query.role as string;
            const ac = new AccessControl(access.grantList);
            const permissions = ac.can("admin");
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
