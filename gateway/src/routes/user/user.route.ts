import express, { Request, Response } from "express";
import { clientUser } from "../../start_server_grpc";
import { auth } from "../../auths/authUtil";

const router = express.Router();

router.get("/", (req, res) => {
    clientUser.GetUsers(null, (err: any, users: any) => {
        if (err) return res.status(500).send(err);
        return res.json(users);
    });
});

router.post("/register", (req: Request, res: Response) => {
    const payload = {
        email: req.body.email,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        sex: req.body.sex,
        date_of_birth: req.body.date_of_birth,
        role_id: req.body.role_id,
        avatar: req.body.avatar,
        client_agent: req.headers["user-agent"],
        client_ip: req.ip,
    };
    // console.log(payload);
    clientUser.RegisterUser(payload, (err: any, data: any) => {
        console.log(err);
        if (err) return res.status(500).json(err);
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
    console.log("session router: ", payload);
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

//shop
router.post(
    "/register/shop",
    new auth().authentication,
    (req: Request, res: Response) => {
        const payload = {
            user_id: req.user.user_id,
            name: req.body.name,
            session: req.session,
        };
        clientUser.RegisterShop(payload, (err: any, data: any) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    }
);

//follow
router.post(
    "/follow",
    new auth().authentication,
    (req: Request, res: Response) => {
        const payload = {
            user_id: req.user.user_id,
            shop_id: req.body.shop_id,
        };
        clientUser.FollowShop(payload, (err: any, data: any) => {
            if (err) return res.status(500).send(err);
            return res.status(200).json(data);
        });
    }
);

router.get("/:shopId/followers", (req: Request, res: Response) => {
    const payload = {
        shop_id: req.params.shopId,
    };
    clientUser.GetShopFollowerList(payload, (err: any, data: any) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json(data);
    });
});

export default router;
