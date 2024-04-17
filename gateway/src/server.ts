import express from "express";
import routes from "./routes";
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(process.env.PORT_SERVER_EXPRESS, async () => {
    console.log("Server running on port 8080");
});
