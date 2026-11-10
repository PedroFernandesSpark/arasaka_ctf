import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { api, setToken, getToken } from "./api";
import Notes from "./pages/Notes";
import Profile from "./pages/Profile";

function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("alt.cunningham@arasaka.int");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const submit = async () => {
    setErr("");
    try {
      const r = await api.login(email, password);
      setToken(r.access_token);
      sessionStorage.setItem("loginFlag", r.flag);
      nav("/notes");
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <main className="login-screen">
      <div className="login-layout">
        <section className="login-art-panel">
          <img
            className="login-cover"
            src="/images/nacar-9-cover.jpg"
            alt="Original illustration of ARASAKA at night, with corporate towers and neon lights."
          />
          <div className="login-art-caption">
            <p className="eyebrow">ARASAKA // signal recovered</p>
            <h2>
              Internal system
              <br />
              ARASAKA.
            </h2>
            <p>Projeto Fantasma / channel 04:17</p>
          </div>
        </section>
        <section className="terminal-card login-card">
          <img
            className="brand-logo"
            src="/images/vesper-arc-logo.png"
            alt="Vesper Arc — Corporate Systems, ARASAKA."
          />
          <div className="login-title">
            <p className="eyebrow">Internal network // monitored access</p>
            <h1>UNKNOWN FILES</h1>
          </div>
          <p className="lead">Use the six-digit access code to login.</p>
          <label className="field-label" htmlFor="email">
            Identifier
          </label>
          <input
            id="email"
            className="terminal-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@vesperarc.local"
          />
          <label className="field-label" htmlFor="password">
            Access PIN
          </label>
          <input
            id="password"
            className="terminal-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="six digits"
            inputMode="numeric"
            maxLength={6}
          />
          <button className="primary-button" onClick={submit}>
            Start session <span aria-hidden="true">→</span>
          </button>
          {err && (
            <p className="error-message" role="alert">
              {err}
            </p>
          )}
          <div className="terminal-status">
            <span className="status-dot" /> Encrypted channel{" "}
            <span>NOITE / 04:17</span>
          </div>
        </section>
      </div>
      <p className="login-footnote">
        Projeto Fantasma // ARASAKA // Monitored access
      </p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/notes"
        element={getToken() ? <Notes /> : <Navigate to="/" />}
      />
      <Route path="/profile/:id" element={<Profile />} />
    </Routes>
  );
}
