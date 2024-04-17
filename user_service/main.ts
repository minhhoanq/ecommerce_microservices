import express, { NextFunction } from "express";
// import client from "../gateway/src/client";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const middleware = (req: any, res: any, next: NextFunction) => {
//     console.log("I am middleware");
//     return next();
// };

// app.use(middleware);

// app.get("/", middleware, (req, res) => {
//     client.GetUsers(null, (err: any, data: any) => {
//         if (err) return res.status(500).send(err);
//         return res.json(data);
//     });
// });

app.listen(5555, () => {
    console.log("Service listening on PORT 5555");
});
