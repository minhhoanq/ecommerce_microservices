import { IUserRepo } from "../interfaces/user.repo.interface";

export class UserRepository implements IUserRepo {
    create(user: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    update(user: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    delete(id: any): Promise<any> {
        throw new Error("Method not implemented.");
    }
    find(limit: number, offset: number): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    findOne(id: number): Promise<any> {
        return Promise.resolve("findOne user");
    }
}
