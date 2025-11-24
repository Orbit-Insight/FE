import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";

const planets = [
  { name: "Mercury", size: 0.3, color: "#aaa", speed: 0.02 },
  { name: "Venus", size: 0.6, color: "#f5e1a4", speed: 0.015 },
  { name: "Earth", size: 0.65, color: "#4f8cff", speed: 0.01 },
  { name: "Mars", size: 0.45, color: "#ff4f4f", speed: 0.008 },
  { name: "Jupiter", size: 1.2, color: "#d9b27c", speed: 0.005 },
  { name: "Saturn", size: 1.0, color: "#f5d97a", speed: 0.004 },
  { name: "Uranus", size: 0.7, color: "#7fffd4", speed: 0.003 },
  { name: "Neptune", size: 0.68, color: "#4b60ff", speed: 0.002 },
];

function Planet({ color, size, speed }) {
  const meshRef = useRef();
  

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed; 
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 32, 32]}>
      <meshStandardMaterial color={color} />
    </Sphere>
  );
}

export default function SingleCompare({ goBack }) {
  const [selected, setSelected] = useState(planets[2]); 

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <button onClick={goBack} style={{ marginBottom: "20px" }}>
        ← 뒤로
      </button>

      <h2>{selected.name} 미리보기</h2>
      <select
        onChange={(e) => setSelected(planets[e.target.value])}
        value={planets.indexOf(selected)}
      >
        {planets.map((p, i) => (
          <option key={p.name} value={i}>
            {p.name}
          </option>
        ))}
      </select>

      <div style={{ width: "300px", height: "300px", margin: "20px auto" }}>
        <Canvas>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={1.2} />
          <Planet color={selected.color} size={selected.size} speed={selected.speed} />
          <OrbitControls enableZoom={true} />
        </Canvas>
      </div>
    </div>
  );
}
