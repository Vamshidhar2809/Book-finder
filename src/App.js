import React, { useState, useEffect, useRef } from "react";
import "./App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [searchBy, setSearchBy] = useState("title");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [numFound, setNumFound] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");
  const controllerRef = useRef(null);

  function buildUrl(q, by, p = 1, limit = 20) {
    if (!q) return null;
    const encoded = encodeURIComponent(q);
    const fieldQuery =
      by === "title"
        ? `title=${encoded}`
        : by === "author"
        ? `author=${encoded}`
        : by === "isbn"
        ? `isbn=${encoded}`
        : `subject=${encoded}`;
    return `https://openlibrary.org/search.json?${fieldQuery}&page=${p}&limit=${limit}`;
  }

  async function fetchResults(q, by, p = 1, append = false) {
    const url = buildUrl(q, by, p);
    if (!url) return;
    if (controllerRef.current) controllerRef.current.abort();
    controllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(url, { signal: controllerRef.current.signal });
      if (!res.ok)
        throw new Error(`Network response was not ok (${res.status})`);
      const data = await res.json();
      const docs = Array.isArray(data.docs) ? data.docs : [];
      setNumFound(data.numFound || docs.length);

      let processed = docs.map((d) => ({
        key: d.key,
        title: d.title,
        author_name: d.author_name || [],
        first_publish_year: d.first_publish_year,
        cover_i: d.cover_i,
        edition_count: d.edition_count,
        subject: d.subject || [],
        isbn: d.isbn || [],
      }));

      if (sortBy === "year") {
        processed.sort(
          (a, b) => (a.first_publish_year || 0) - (b.first_publish_year || 0)
        );
      }

      setResults((prev) => (append ? [...prev, ...processed] : processed));
      setPage(p);
    } catch (err) {
      if (err.name === "AbortError") return;
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    e && e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a search term");
      return;
    }
    fetchResults(query.trim(), searchBy, 1, false);
  }

  function loadMore() {
    const next = page + 1;
    fetchResults(query.trim(), searchBy, next, true);
  }

  const suggestions = [
    "harry potter",
    "data structures",
    "machine learning",
    "tolstoy",
    "chemistry",
  ];

  function getCoverUrl(cover_i, size = "M") {
    if (!cover_i) return null;
    return `https://covers.openlibrary.org/b/id/${cover_i}-${size}.jpg`;
  }

  return (
    <div className="app-root">
      <header className="header">
        <h1 className="title">📚 Book Finder</h1>
        <p className="subtitle">
          Search millions of books from Open Library — perfect for Alex, the
          college student.
        </p>
      </header>

      <main className="container">
        <form className="search" onSubmit={handleSearch}>
          <div className="search-row">
            <input
              className="search-input"
              placeholder="Search by title, author, ISBN or subject..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <select
              value={searchBy}
              onChange={(e) => setSearchBy(e.target.value)}
              className="select-field"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="isbn">ISBN</option>
              <option value="subject">Subject</option>
            </select>

            <button type="submit" className="btn">
              Search
            </button>
          </div>

          <div className="controls">
            <div className="small">Sort:</div>
            <div className="btn-group">
              <button
                type="button"
                className={`chip ${sortBy === "relevance" ? "active" : ""}`}
                onClick={() => setSortBy("relevance")}
              >
                Relevance
              </button>
              <button
                type="button"
                className={`chip ${sortBy === "year" ? "active" : ""}`}
                onClick={() => setSortBy("year")}
              >
                Year
              </button>
            </div>

            <div className="small">Quick:</div>
            <div className="suggestions">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  className="suggest"
                  onClick={() => {
                    setQuery(s);
                    setSearchBy("title");
                    fetchResults(s, "title", 1, false);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </form>

        <section className="results">
          {error && <div className="error">{error}</div>}
          {loading && <div className="loading">Loading...</div>}

          {!loading && !error && results.length === 0 && (
            <div className="empty">
              No results yet. Try searching for a book title (e.g., "Harry
              Potter").
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <div className="meta">
                Found {numFound} results — showing {results.length} items (page{" "}
                {page})
              </div>

              <ul className="grid">
                {results.map((r) => (
                  <li className="card" key={r.key}>
                    <div className="cover">
                      {r.cover_i ? (
                        <img
                          src={getCoverUrl(r.cover_i, "M")}
                          alt={`${r.title} cover`}
                        />
                      ) : (
                        <div className="no-cover">No cover</div>
                      )}
                    </div>
                    <div className="info">
                      <h3 className="book-title">{r.title}</h3>
                      <div className="authors">
                        {r.author_name.join(", ") || "Unknown Author"}
                      </div>
                      <div className="meta-row">
                        <span>
                          First published: {r.first_publish_year || "—"}
                        </span>
                        <span>Editions: {r.edition_count || 0}</span>
                      </div>
                      <div className="actions">
                        <a
                          className="link"
                          href={`https://openlibrary.org${r.key}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          View
                        </a>
                        {r.isbn && r.isbn[0] && (
                          <a
                            className="link"
                            href={`https://www.google.com/search?q=ISBN+${r.isbn[0]}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Buy
                          </a>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="pager">
                <button className="btn" onClick={loadMore} disabled={loading}>
                  Load more
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <div>
          Built for Alex — search books quickly for study or leisure. Data from
          Open Library.
        </div>
        <div className="small muted">
          Tip: try title searches for best results.
        </div>
      </footer>
    </div>
  );
}