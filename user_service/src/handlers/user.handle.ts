import { UserRepository } from "../repositories/user.repository";
import { UserService } from "../services/user.service";
import { decode_token } from "../helpers/jwt";
import { sendUnaryData, status } from "@grpc/grpc-js";
import { LoginUser, RegisterUser, SessionUser } from "../dto/user.dto";
import { RoleService } from "../services/role.service";
import { ResourceService } from "../services/resource.service";
import { RbacService } from "../services/rbac.service";
import { RequestValidator } from "../utils/request.validator";
import { statusCode } from "../utils/httpStatusCode";

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
                // Kiem tra doi so dau vao
                try {
                    const { errors, input } = await RequestValidator(
                        RegisterUser,
                        data
                    );
                    if (errors) {
                        callback(
                            {
                                code: status.INVALID_ARGUMENT,
                                message: "Invalid input data",
                                details: errors,
                            },
                            null
                        );
                        return;
                    }
                    // Nếu không có lỗi, tiếp tục đăng ký người dùng
                    const register = await userService.register(
                        input,
                        client_ip,
                        client_agent
                    );
                    callback(null, register);
                } catch (error) {
                    this.handlerError(error, callback);
                }
            },

            LoginUser: async (call: any, callback: any) => {
                try {
                    // console.log(call.request);
                    const { client_agent, client_ip, ...data } = call.request;
                    // console.log(client_agent, client_ip, data);
                    const { errors, input } = await RequestValidator(
                        LoginUser,
                        data
                    );
                    if (errors) {
                        callback(
                            {
                                code: status.INVALID_ARGUMENT,
                                message: "Invalid input data",
                                details: errors,
                            },
                            null
                        );
                        return;
                    }
                    const login = await userService.login(
                        input,
                        client_ip,
                        client_agent
                    );

                    callback(null, login);
                } catch (error) {
                    // console.error("Error during registration:", error);
                    this.handlerError(error, callback);
                }
            },

            LogoutUser: async (call: any, callback: any) => {
                try {
                    const session = call.request;
                    console.log("session user handler", session);
                    const { errors, input } = await RequestValidator(
                        SessionUser,
                        session
                    );
                    if (errors) {
                        callback(
                            {
                                code: status.INVALID_ARGUMENT,
                                message: "Invalid input data",
                                details: errors,
                            },
                            null
                        );
                        return;
                    }
                    const logout = await userService.logout(input);

                    callback(null, logout);
                } catch (error) {
                    this.handlerError(error, callback);
                }
            },

            RefreshTokenUser: async (call: any, callback: any) => {
                try {
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

                    callback(null, refreshToken);
                } catch (error) {
                    this.handlerError(error, callback);
                }
            },

            GetSessionUser: async (
                call: any,
                callback: (_: any, callback: any) => void
            ) => {
                try {
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
                } catch (error) {
                    this.handlerError(error, callback);
                }
            },

            DecodeToken: async (
                call: any,
                callback: (_: any, callback: any) => void
            ) => {
                try {
                    // console.log(call.request);
                    const { token, key } = call.request;
                    const decode_user = await decode_token(token, key);

                    callback(null, decode_user);
                } catch (error) {
                    this.handlerError(error, callback);
                }
            },

            CreateRole: async (
                call: any,
                callback: (_: any, callback: any) => void
            ) => {
                try {
                    const { name } = call.request;
                    const role = await roleService.createRole(name);
                    callback(null, role);
                } catch (error) {}
            },

            CreateResource: async (
                call: any,
                callback: (_: any, callback: any) => void
            ) => {
                try {
                    const { name, slug, desc } = call.request;
                    const resource = await resourceService.CreateRource(
                        name,
                        slug,
                        desc
                    );
                    callback(null, resource);
                } catch (error) {
                    this.handlerError(error, callback);
                }
            },

            CreateRoleResource: async (
                call: any,
                callback: (_: any, callback: any) => void
            ) => {
                try {
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
                } catch (error) {
                    this.handlerError(error, callback);
                }
            },

            GetAccess: async (
                call: any,
                callback: (_: any, callback: any) => void
            ) => {
                try {
                    const { role_id, resource } = call.request;
                    console.log(role_id, resource);
                    const accessList = await rbacService.getAccessList(
                        role_id,
                        resource
                    );
                    console.log(accessList);
                    callback(null, accessList);
                } catch (error) {
                    this.handlerError(error, callback);
                }
            },

            RegisterShop: async (call: any, callback: any) => {
                try {
                    const { session, ...data } = call.request;
                    console.log(call.request);
                    const registerShop = await userService.registerShop(
                        data,
                        session
                    );
                    console.log(registerShop);
                    callback(null, registerShop);
                } catch (error) {
                    this.handlerError(error, callback);
                }
            },
        };

        return handle;
    }
    private static handlerError(error: unknown, callback: sendUnaryData<any>) {
        if (error instanceof Error) {
            callback({ message: error.message, code: status.INTERNAL });
        }
    }
}
