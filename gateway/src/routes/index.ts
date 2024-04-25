import express from "express";
import userRouter from "./user/user.route";
import productRouter from "./product/product.route";
import adminRouter from "./admin/admin.route";
import notificationRouter from "./notification/notification.route";

const router = express.Router();

router.use("/api/v1/user", userRouter);
router.use("/api/v1/product", productRouter);
router.use("/api/v1/admin", adminRouter);
router.use("/api/v1/notification", notificationRouter);

export default router;
