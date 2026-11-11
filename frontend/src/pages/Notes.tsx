import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, logout } from "../api";

export default function Notes() {
  const nav = useNavigate();
  const [notes, setNotes] = useState<any[]>([]);
  const [publicFiles, setPublicFiles] = useState<any[]>([]);
  const [term, setTerm] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loadError, setLoadError] = useState("");
  const [loginFlag] = useState(() => {
    const flag = sessionStorage.getItem("loginFlag");
    sessionStorage.removeItem("loginFlag");
    return flag;
  });

  const load = async () => {
    try {
      const [personalFiles, sharedFiles] = await Promise.all([
        api.notes(),
        api.publicFiles(),
      ]);
      setNotes(personalFiles);
      setPublicFiles(sharedFiles);
      setLoadError("");
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Failed to load the archive.",
      );
    }
  };
  useEffect(() => {
    load();
  }, []);

  const doSearch = async () => setNotes(await api.search(term));
  const add = async () => {
    await api.createNote(title, content);
    setTitle("");
    setContent("");
    load();
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <Link className="wordmark" to="/notes">
          <img
            className="wordmark-logo"
            src="/images/arasaka-logo.png"
            alt="ARASAKA"
          />{" "}
          <span className="wordmark-divider">//</span> ARASAKA SUBNET
        </Link>
        <div className="topbar-actions">
          <span className="connection-state">
            <span className="status-dot" /> SESSION ACTIVE
          </span>
          <button
            className="quiet-button"
            onClick={() => {
              logout();
              nav("/login");
            }}
          >
            End session
          </button>
        </div>
      </header>

      <section className="dashboard-banner">
        <img
          src="/images/nacar-9-cover.jpg"
          alt="Panoramic view of ARASAKA, a vertical city under neon lights."
        />
        <div className="dashboard-heading">
          <p className="eyebrow">Corporate subnet // sector 09</p>
          <h1>Recovered files</h1>
          <p className="lead">
            Public records recovered from Arasaka's internal network.
          </p>
          <Link className="text-link" to="/profile">
            Open operator profile <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      {loginFlag && (
        <section className="flag-banner" aria-live="polite">
          <div>
            <p className="eyebrow">Flag 01 // credential recovered</p>
            <strong>{loginFlag}</strong>
          </div>
        </section>
      )}

      {loadError && (
        <p className="error-message" role="alert">
          {loadError}
        </p>
      )}

      <section className="terminal-card search-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Local query</p>
            <h2>Search records</h2>
          </div>
          <span className="micro-label">IDX // 05</span>
        </div>
        <div className="search-row">
          <input
            className="terminal-input"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="search term..."
          />
          <button className="primary-button compact" onClick={doSearch}>
            Search
          </button>
        </div>
      </section>

      <section className="terminal-card records-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Open directory // public read</p>
            <h2>Terminal files</h2>
          </div>
          <span className="micro-label">
            {publicFiles.length.toString().padStart(2, "0")} FILES
          </span>
        </div>
        {publicFiles.length ? (
          <ul className="record-list">
            {publicFiles.map((n, i) => (
              <li className="record" key={i}>
                <span className="record-index">
                  {String(n.id).padStart(2, "0")}
                </span>
                <div>
                  <h3>{n.title}</h3>
                  <p>{n.content}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No public files found.</p>
        )}
      </section>

      <section className="terminal-card records-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Personal area</p>
            <h2>My files</h2>
          </div>
          <span className="micro-label">
            {notes.length.toString().padStart(2, "0")} ITEMS
          </span>
        </div>
        {notes.length ? (
          <ul className="record-list">
            {notes.map((n) => (
              <li className="record" key={n.id}>
                <span className="record-index">
                  {String(n.id).padStart(2, "0")}
                </span>
                <div>
                  <h3>{n.title}</h3>
                  <p>{n.content}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="empty-state">No personal files.</p>
        )}
      </section>

      <section className="terminal-card compose-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Manual entry</p>
            <h2>New record</h2>
          </div>
          <span className="micro-label">DRAFT</span>
        </div>
        <input
          className="terminal-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="record title"
        />
        <textarea
          className="terminal-input terminal-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="content"
        />
        <button className="primary-button compact" onClick={add}>
          Save to archive <span aria-hidden="true">＋</span>
        </button>
      </section>

      <footer className="page-footer">
        <span>ARASAKA // Internal network</span>
        <span>Every access leaves a trace.</span>
      </footer>
    </main>
  );
}
