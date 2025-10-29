import express from "express";
import {
  getMovieShows,
  getMovieShowById,
  createMovieShow,
  updateMovieShow,
  deleteMovieShow,
} from "../controllers/movieShowController.js";
import { protect } from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router
  .route("/")
  .get(protect, getMovieShows)
  .post(protect, upload.single("poster"), createMovieShow);

router
  .route("/:id")
  .get(protect, getMovieShowById)
  .put(protect, upload.single("poster"), updateMovieShow)
  .delete(protect, deleteMovieShow);

export default router;
