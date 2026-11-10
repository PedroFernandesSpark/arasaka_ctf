import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api";

export default function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [bio, setBio] = useState("");

  useEffect(() => {
    api.profile(id!).then((u) => {
      setUser(u);
      setBio(u.bio);
    });
  }, [id]);

  if (!user)
    return (
      <main className="app-shell">
        <p className="empty-state">Loading profile...</p>
      </main>
    );

  const save = async () => {
    await api.updateBio(bio);
    location.reload();
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
        <Link className="quiet-button link-button" to="/notes">
          ← Back to archive
        </Link>
      </header>
      <section className="dashboard-heading">
        <p className="eyebrow">Personnel directory // authorized read</p>
        <h1>Operator profile</h1>
      </section>
      <section className="terminal-card profile-card">
        <div className="profile-identity">
          <img
            className="profile-avatar"
            src="/images/alt-cunningham-portrait.jpg"
            alt="Original illustrated portrait of Alt Cunningham."
          />
          <div>
            <p className="eyebrow">Identity verified</p>
            <h2>{user.email}</h2>
            <span className="micro-label">ROLE // {user.role}</span>
          </div>
        </div>
        <div className="profile-divider" />
        <p className="eyebrow">Public transmission</p>
        <p className="profile-bio">{user.bio}</p>
      </section>
      <section className="terminal-card compose-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Record update</p>
            <h2>Edit transmission</h2>
          </div>
        </div>
        <textarea
          className="terminal-input terminal-textarea"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <div className="button-row">
          <button className="primary-button compact" onClick={save}>
            Save changes
          </button>
        </div>
      </section>
      <footer className="page-footer">
        <span>ARASAKA // Personnel records</span>
        <span>Canal monitorado.</span>
      </footer>
    </main>
  );
}
