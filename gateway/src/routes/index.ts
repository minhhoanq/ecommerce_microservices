import express from "express";
import userRouter from "./user/user.route";
import productRouter from "./product/product.route";
import adminRouter from "./admin/admin.route";

const router = express.Router();

router.use("/api/v1/user", userRouter);
router.use("/api/v1/product", productRouter);
router.use("/api/v1/admin", adminRouter);

export default router;
