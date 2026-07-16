import React, { useState } from "react";

const StarIcon = ({ filled, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#d4a373" : "none"} stroke={filled ? "#d4a373" : "#c9c1ba"} strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2.5l2.9 6.02 6.6.87-4.83 4.6 1.2 6.6L12 17.6l-5.87 3-1.2-6.6L.1 9.4l6.6-.87L12 2.5z" />
  </svg>
);

export const StarRatingDisplay = ({ promedio = 0, size = 16, showValue = true, cantidad }) => {
  const estrellas = [1, 2, 3, 4, 5];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <div style={{ display: "flex", gap: "1px" }}>
        {estrellas.map((n) => (
          <StarIcon key={n} filled={n <= Math.round(promedio)} size={size} />
        ))}
      </div>
      {showValue ? (
        <span style={{ fontSize: "13px", fontWeight: "600", color: "#3b3735" }}>
          {promedio > 0 ? promedio.toFixed(1) : "—"}
        </span>
      ) : null}
      {cantidad !== undefined ? (
        <span style={{ fontSize: "12px", color: "#918a83" }}>({cantidad})</span>
      ) : null}
    </div>
  );
};

export const StarRatingInput = ({ value, onChange, size = 26 }) => {
  const [hover, setHover] = useState(0);
  const estrellas = [1, 2, 3, 4, 5];

  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {estrellas.map((n) => (
        <div
          key={n}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          style={{ cursor: "pointer" }}
        >
          <StarIcon filled={n <= (hover || value)} size={size} />
        </div>
      ))}
    </div>
  );
};