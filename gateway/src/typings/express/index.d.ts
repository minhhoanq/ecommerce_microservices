declare module Express {
    export interface Request {
        user?: any;
        session?: any;
        refresh_token?: string;
    }
}
