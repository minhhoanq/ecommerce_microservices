import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { decode_token } from "../helpers/jwt";
import { LoginUser } from "../dto/user.dto";
import { RoleService } from "../services/role.service";
import { ResourceService } from "../services/resource.service";
import { RbacService } from "../services/rbac.service";

export const userService = new UserService(new UserRepository());
export const roleService = new RoleService();
export const resourceService = new ResourceService();
export const rbacService = new RbacService();

export class UserHandlerFactory {
    public static userHandlers(): any {
        const handle = {
            GetUsers: async (call: any, callback: any) => {
                const users = await userService.getUsers();
                callback(null, users);
            },

            RegisterUser: async (call: any, callback: any) => {
                const { client_agent, client_ip, ...data } = call.request;
                // console.log(call.request);
                // console.log(data);
                // console.log(client_agent);
                // console.log(client_ip);
                const register = await userService.register(
                    data,
                    client_ip,
                    client_agent
                );

                callback(null, register);
            },

            LoginUser: async (call: any, callback: any) => {
                console.log(call.request);
                const { client_agent, client_ip, ...data } = call.request;
                console.log(client_agent, client_ip, data);
                const login = await userService.login(
                    data,
                    client_ip,
                    client_agent
                );

                callback(null, login);
            },

            LogoutUser: async (call: any, callback: any) => {
                const session = call.request;
                const logout = await userService.logout(session);

                callback(null, logout);
            },

            RefreshTokenUser: async (call: any, callback: any) => {
                const {
                    user,
                    refresh_token,
                    session,
                    client_agent,
                    client_ip,
                } = call.request;
                const refreshToken = await userService.refreshToken(
                    user,
                    refresh_token,
                    session,
                    client_agent,
                    client_ip
                );

                console.log(refreshToken);

                callback(null, refreshToken);
            },

            GetSessionUser: async (
                call: any,
                callback: (_: any, callback: any) => void
            ) => {
                console.log(call.request);
                const { email, client_agent, client_ip } = call.request;
                console.log("email1 ", email);
                const session = await userService.getSessionUser(
                    email,
                    client_agent,
                    client_ip
                );
                // console.log(session);
                callback(null, session);
            },

            DecodeToken: async (
                call: any,
                callback: (_: any, callback: any) => void
            ) => {
                // console.log(call.request);
                const { token, key } = call.request;
                const decode_user = await decode_token(token, key);

                callback(null, decode_user);
            },

            CreateRole: async (
                call: any,
                callback: (_: any, callback: any) => void
            ) => {
                const { name } = call.request;
                const role = await roleService.createRole(name);
                callback(null, role);
            },

            CreateResource: async (
                call: any,
                callback: (_: any, callback: any) => void
            ) => {
                const { name, slug, desc } = call.request;
                const resource = await resourceService.CreateRource(
                    name,
                    slug,
                    desc
                );
                callback(null, resource);
            },

            CreateRoleResource: async (
                call: any,
                callback: (_: any, callback: any) => void
            ) => {
                console.log("cachaiwuc");
                const { role_id, resource_id, action, attributes } =
                    call.request;
                const roleResource = await rbacService.createRoleResource(
                    role_id,
                    resource_id,
                    action,
                    attributes
                );
                callback(null, roleResource);
            },

            GetAccess: async (
                call: any,
                callback: (_: any, callback: any) => void
            ) => {
                const { role_id, resource } = call.request;
                console.log(role_id, resource);
                const accessList = await rbacService.getAccessList(
                    role_id,
                    resource
                );
                console.log(accessList);
                callback(null, accessList);
            },
        };

        return handle;
    }
}
