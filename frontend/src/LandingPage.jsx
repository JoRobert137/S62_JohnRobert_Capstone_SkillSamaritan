import React from "react";
import { Link } from "react-router-dom"; // Ensure you're using react-router
import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page">
      <header className="header">
        <h1 className="title">SkillSamaritan</h1>
        <p className="subtitle">
          Where Talent Meets Kindness – a platform to share your skills and help your local community grow.
        </p>
      </header>

      <main className="card">
        <h2 className="card-title">Get Started</h2>
        <p className="card-text">Sign up or log in to begin your journey.</p>
        <div className="button-group">
          <Link to="/signup" className="btn-primary">Sign Up</Link>
          <Link to="/login" className="btn-outline">Log In</Link>
        </div>
      </main>
    </div>
  );
}

export default LandingPage;
