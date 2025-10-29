import MovieShow from "../models/MovieShow.js";
import { movieShowSchema, validateData } from "../utils/validation.js";

// @desc    Get all movies/shows with pagination and search
// @route   GET /api/movies
// @access  Private
export const getMovieShows = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";
    const type = req.query.type || "";
    const sortBy = req.query.sortBy || "-createdAt";

    // Build query
    let query = { user: req.user._id };

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { director: { $regex: search, $options: "i" } },
        { genre: { $regex: search, $options: "i" } },
      ];
    }

    // Add type filter
    if (type) {
      query.type = type;
    }

    // Get total count
    const total = await MovieShow.countDocuments(query);

    // Get paginated results
    const movieShows = await MovieShow.find(query)
      .sort(sortBy)
      .limit(limit)
      .skip(skip);

    res.json({
      movieShows,
      page,
      pages: Math.ceil(total / limit),
      total,
      hasMore: skip + movieShows.length < total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single movie/show by ID
// @route   GET /api/movies/:id
// @access  Private
export const getMovieShowById = async (req, res) => {
  try {
    const movieShow = await MovieShow.findById(req.params.id);

    if (!movieShow) {
      return res.status(404).json({ message: "Movie/Show not found" });
    }

    // Check if user owns this movie/show
    if (movieShow.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(movieShow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new movie/show
// @route   POST /api/movies
// @access  Private
export const createMovieShow = async (req, res) => {
  try {
    const movieShowData = req.body;

    // Validate input
    const validation = await validateData(movieShowSchema, movieShowData);
    if (!validation.valid) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: validation.errors });
    }

    // Add poster if file was uploaded
    if (req.file) {
      movieShowData.poster = `/uploads/${req.file.filename}`;
    }

    // Create movie/show
    const movieShow = await MovieShow.create({
      ...movieShowData,
      user: req.user._id,
    });

    res.status(201).json(movieShow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update movie/show
// @route   PUT /api/movies/:id
// @access  Private
export const updateMovieShow = async (req, res) => {
  try {
    const movieShow = await MovieShow.findById(req.params.id);

    if (!movieShow) {
      return res.status(404).json({ message: "Movie/Show not found" });
    }

    // Check if user owns this movie/show
    if (movieShow.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const movieShowData = req.body;

    // Validate input
    const validation = await validateData(movieShowSchema, movieShowData);
    if (!validation.valid) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: validation.errors });
    }

    // Update poster if file was uploaded
    if (req.file) {
      movieShowData.poster = `/uploads/${req.file.filename}`;
    }

    // Update movie/show
    const updatedMovieShow = await MovieShow.findByIdAndUpdate(
      req.params.id,
      movieShowData,
      { new: true, runValidators: true }
    );

    res.json(updatedMovieShow);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete movie/show
// @route   DELETE /api/movies/:id
// @access  Private
export const deleteMovieShow = async (req, res) => {
  try {
    const movieShow = await MovieShow.findById(req.params.id);

    if (!movieShow) {
      return res.status(404).json({ message: "Movie/Show not found" });
    }

    // Check if user owns this movie/show
    if (movieShow.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await MovieShow.findByIdAndDelete(req.params.id);

    res.json({ message: "Movie/Show deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
