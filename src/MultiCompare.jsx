import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { planets } from "./SingleCompare"; 

function Planet({ color, size }) {
  return (
    <Sphere args={[size, 32, 32]}>
      <meshStandardMaterial color={color} />
    </Sphere>
  );
}

export default function MultiCompare({ goBack }) {
  const [planet1, setPlanet1] = useState(planets[2]); 
  const [planet2, setPlanet2] = useState(planets[3]); 

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <button onClick={goBack} style={{ marginBottom: "20px" }}>
        ← 뒤로
      </button>

      <h2>행성 비교</h2>
      <div style={{ marginBottom: "20px" }}>
        <select onChange={(e) => setPlanet1(planets[e.target.value])}>
          {planets.map((p, i) => (
            <option key={p.name} value={i}>
              {p.name}
            </option>
          ))}
        </select>
        <select onChange={(e) => setPlanet2(planets[e.target.value])}>
          {planets.map((p, i) => (
            <option key={p.name} value={i}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "40px" }}>
        {[planet1, planet2].map((p) => (
          <div key={p.name}>
            <h3>{p.name}</h3>
            <div style={{ width: "250px", height: "250px" }}>
              <Canvas>
                <ambientLight intensity={0.3} />
                <pointLight position={[5, 5, 5]} intensity={1.2} />
                <Planet color={p.color} size={p.size} />
                <OrbitControls enableZoom={true} />
              </Canvas>
            </div>
            <p>크기: {p.size}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
