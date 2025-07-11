"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ThemeToggle } from "./components/ThemeToggle";
import Image from "next/image";

const SORT_OPTIONS = [
  { value: "popularity.desc", label: "Popularity (desc)" },
  { value: "popularity.asc", label: "Popularity (asc)" },
  { value: "release_date.desc", label: "Release Date (desc)" },
  { value: "release_date.asc", label: "Release Date (asc)" },
];

const GENRES = [
  { value: "", label: "All Genres" },
  { value: "28", label: "Action" },
  { value: "35", label: "Comedy" },
  { value: "18", label: "Drama" },
  { value: "27", label: "Horror" },
  // Add more genres as needed
];

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [genre, setGenre] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const filter = genre ? `genre:${genre}` : "";
        const res = await axios.get(`http://localhost:3333/api/movies`, {
          params: { page, sort, filter },
        });
        setMovies(res.data.results);
        setTotalPages(res.data.total_pages);
      } catch (err) {
        setMovies([]);
        setTotalPages(1);
      }
      setLoading(false);
    };
    fetchMovies();
  }, [page, sort, genre]);

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "2rem auto",
        padding: 16,
        color: "var(--text)",
        minHeight: "100vh",
      }}
    >
      <ThemeToggle />
      <div
        style={{
          display: "flex",
          gap: 16,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <label>
          Sort by:
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        <label>
          Genre:
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            {GENRES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      {loading ? (
        <p>Loading....</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {movies.map((movie) => (
            <li
              key={movie.id}
              style={{
                marginBottom: 24,
                borderBottom: "1px solid var(--border)",
                paddingBottom: 16,
                backgroundColor: "var(--card-bg)",
                padding: "16px",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            >
              <div className="flex">
                <Image
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  width={80}
                  height={100}
                  alt="Picture of the author"
                />
                <div className="pl-4">
                  <strong style={{ color: "var(--text)" }}>
                    {movie.title}
                  </strong>{" "}
                  ({movie.release_date})<br />
                  <span style={{ color: "var(--text)" }}>
                    Popularity: {movie.popularity}
                  </span>
                  <br />
                  <span style={{ color: "var(--text)" }}>
                    Rating: {movie.vote_average}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginTop: 24,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span style={{ color: "var(--text)" }}>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
