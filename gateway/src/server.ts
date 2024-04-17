import express from "express";
import routes from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(8080, async () => {
    console.log("Server running on port 8080");
});
