import mongoose from "mongoose";

const movieShowSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Please specify type (Movie or TV Show)"],
      enum: ["Movie", "TV Show"],
    },
    director: {
      type: String,
      required: [true, "Please provide director name"],
      trim: true,
    },
    budget: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    duration: {
      type: String,
      required: [true, "Please provide duration"],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, "Please provide year"],
    },
    genre: {
      type: String,
      trim: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
    },
    description: {
      type: String,
      trim: true,
    },
    poster: {
      type: String,
      default: "",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
movieShowSchema.index({ title: "text", director: "text", genre: "text" });

const MovieShow = mongoose.model("MovieShow", movieShowSchema);

export default MovieShow;
