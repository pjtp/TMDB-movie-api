require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3333;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3/discover/movie";

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

// GET /api/movies?page=1&sort=popularity.desc&filter=genre:28
app.get("/api/movies", async (req, res) => {
  try {
    const { page = 1, sort = "popularity.desc", filter = "" } = req.query;
    let params = {
      api_key: TMDB_API_KEY,
      page,
      sort_by: sort,
    };

    if (filter) {
      const [type, value] = filter.split(":");
      if (type === "genre") {
        params.with_genres = value;
      }
    }

    const response = await axios.get(TMDB_BASE_URL, { params });
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching movies:", error.message);
    res
      .status(500)
      .json({ error: "Failed to fetch movies", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
