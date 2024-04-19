import express from "express";

const router = express.Router();

//artists
router.get("/artists");
router.post("/artists");
router.put("/artists/:artist_id");
router.delete("/artists/:artist_id");

router.get("/artists/album/:artist_id");

//categories
router.get("/categories");
router.post("/categories");

//songs
router.get("/song");

//album
router.get("/album");
router.get("/album/:album_id");

export default router;
