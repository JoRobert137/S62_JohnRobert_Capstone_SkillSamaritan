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

      <div className="card">
        <h2 className="card-title">Get Started</h2>
        <p className="card-text">Sign up or log in to begin your journey.</p>
        <div className="button-group">
          <button className="btn-primary">Sign Up</button>
          <button className="btn-outline">Log In</button>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
