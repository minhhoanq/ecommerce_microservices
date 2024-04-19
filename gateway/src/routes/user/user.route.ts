import express, { Request, Response } from "express";
import { clientUser } from "../../start_server_grpc";
import { auth } from "../../auths/authUtil";

const router = express.Router();

router.post("/register", (req: Request, res: Response) => {
    const payload = {
        email: req.body.email,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        sex: req.body.sex,
        date_of_birth: req.body.date_of_birth,
        avatar: req.body.avatar,
        client_agent: req.headers["user-agent"],
        client_ip: req.ip,
    };
    console.log(payload);
    clientUser.RegisterUser(payload, (err: any, data: any) => {
        if (err) return res.status(500).send(err);
        // console.log(data);
        return res.status(200).json(data);
    });
});

router.post("/login", (req: Request, res: Response) => {
    const payload = {
        email: req.body.email,
        password: req.body.password,
        client_agent: req.headers["user-agent"],
        client_ip: req.ip,
    };
    console.log(payload);
    clientUser.LoginUser(payload, (err: any, data: any) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json(data);
    });
});

router.post("/logout", new auth().authentication, (req, res) => {
    const payload = req.session;
    clientUser.LogoutUser(payload, (err: any, data: any) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json(data);
    });
});

router.post("/refresh", new auth().authentication, (req, res) => {
    const payload = {
        user: req.user,
        refresh_token: req.refresh_token,
        session: req.session,
        client_agent: req.headers["user-agent"],
        client_ip: req.ip,
    };
    console.log(payload);
    clientUser.RefreshTokenUser(payload, (err: any, data: any) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json(data);
    });
});

//localhost:8080/api/v1/admin/artists?search=

export default router;
