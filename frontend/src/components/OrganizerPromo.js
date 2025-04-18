import React from "react";
import "./OrganizerPromo.css";

const OrganizerPromo = () => {
  return (
    <div
      className="organizer-promo"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?cs=srgb&dl=pexels-sebastian-ervi-866902-1763075.jpg&fm=jpg')`
      }}
    >
      <div className="overlay">
        <h2>Organizezi un eveniment?</h2>
        <p>Oricine poate începe să vândă bilete în doar câteva minute!</p>
        <a href="/request-organizer" className="promo-button">
          AFLĂ MAI MULTE
        </a>
      </div>
    </div>
  );
};

export default OrganizerPromo;
