import React from "react";
import "./VideoBanner.css";

const VideoBanner = () => {
  return (
    <div className="video-banner">
      <video
        autoPlay
        loop
        playsInline
        className="video-bg"
        preload="auto"
      >
        <source
          src="https://livetickets.blob.core.windows.net/misc/intro.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="video-overlay">
        <h1 className="video-title">The simplest ticketing experience</h1>
        <div className="scroll-down-indicator">
          <span className="arrow">&#8595;</span>
          <p>Scroll down to complete the form</p>
        </div>
      </div>
    </div>
  );
};

export default VideoBanner;
