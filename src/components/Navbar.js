import React from 'react';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="logo-icon">⛅</span>
        <h1>SkyPulse</h1>
      </div>
      <p className="navbar-tagline">Live Weather Forecasts</p>
    </nav>
  );
};

export default Navbar;