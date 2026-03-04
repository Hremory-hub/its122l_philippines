import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Hotel Philippines</h1>
          <p>Experience luxury and comfort in the heart of the Philippines</p>
          <Link to="/bookings" className="btn-cta">
            Book Now
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Luxury Rooms</h3>
              <p>Spacious and elegantly furnished rooms with modern amenities</p>
            </div>
            <div className="feature-card">
              <h3>Fine Dining</h3>
              <p>Experience exquisite Filipino and international cuisine</p>
            </div>
            <div className="feature-card">
              <h3>Premium Service</h3>
              <p>24/7 concierge and room service at your disposal</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
          min-height: 100vh;
        }

        .hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 100px 24px;
          text-align: center;
        }

        .hero-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .hero h1 {
          font-size: 48px;
          margin-bottom: 16px;
        }

        .hero p {
          font-size: 20px;
          margin-bottom: 32px;
          opacity: 0.9;
        }

        .btn-cta {
          display: inline-block;
          background: white;
          color: #667eea;
          padding: 16px 40px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: 600;
          font-size: 18px;
          transition: transform 0.2s;
        }

        .btn-cta:hover {
          transform: translateY(-2px);
        }

        .features {
          padding: 80px 24px;
          background: #f9f9f9;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .features h2 {
          text-align: center;
          font-size: 36px;
          margin-bottom: 48px;
          color: #333;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
        }

        .feature-card {
          background: white;
          padding: 32px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .feature-card h3 {
          font-size: 24px;
          margin-bottom: 12px;
          color: #333;
        }

        .feature-card p {
          color: #666;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default Home;
