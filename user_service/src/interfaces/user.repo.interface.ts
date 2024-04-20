export interface IUserRepo {
    create(user: any): Promise<any>;
    update(user: any): Promise<any>;
    delete(id: any): Promise<any>;
    find(limit: number, offset: number): Promise<any[]>;
    findOne(id: number): Promise<any>;
}
