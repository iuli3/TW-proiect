import React from "react";
import "./BenefitsSection.css";

const benefits = [
  {
    gif:"https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExb3o3YmdrazkxenJzN252bmc0Y2ZmN3prNXpibmE4Nm9nNDhudjJwdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/4XDztBSUmz2kJSmyaN/giphy.gif",
    title: "Bilete digitale instant",
    description: "Primești biletele pe loc, direct în contul tău.",
    backText: "Fără griji! Biletul tău apare instant în cont.",
  },
  {
    gif:"https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdGZ6dnc2ZzdoZWRuMjN0Y2ZjaXpwaGxjMmFqb214NnAxdG9rN2w0NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cmTFUYZp8x1LygtFrV/giphy.gif",
    title: "Plăți securizate",
    description: "Folosim cele mai sigure metode de plată online.",
    backText: "Sistemele noastre respectă cele mai noi standarde de securitate.",
  },
  {
    gif: "https://media2.giphy.com/media/vmQAsNXEgvItJxpgL4/giphy.gif",
    title: "Acces rapid la evenimente",
    description: "Scanezi codul QR și intri în câteva secunde.",
    backText: "Tot ce ai nevoie e în telefonul tău!",
  },
];

const BenefitsSection = () => {
  return (
    <section className="benefits-section">
      <h2 className="text-center mb-5">✨ De ce să alegi Eventix?</h2>
      <div className="benefits-wrapper">
        {benefits.map((benefit, idx) => (
          <div className="flip-card" key={idx}>
            <div className="flip-card-inner">
              <div className="flip-card-front">
                {benefit.gif ? (
                  <img
                    src={benefit.gif}
                    alt="benefit"
                    className="benefit-gif"
                  />
                ) : (
                  <div className="icon">{benefit.icon}</div>
                )}
                <h5>{benefit.title}</h5>
                <p>{benefit.description}</p>
              </div>
              <div className="flip-card-back">
                <p>{benefit.backText}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection;
