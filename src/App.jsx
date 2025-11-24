// App.jsx (수정 부분만 강조)
import { useState } from "react";
import "./App.css";
import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";

const planetData = [
  { name: "수성", colorClass: "p-mercury", radius: "2,439 km", mass: "3.3e23 kg", distance: 60, period: 4.15 },
  { name: "금성", colorClass: "p-venus", radius: "6,052 km", mass: "4.87e24 kg", distance: 90, period: 10.3 },
  { name: "지구", colorClass: "p-earth", radius: "6,371 km", mass: "5.97e24 kg", distance: 130, period: 16.0 },
  { name: "화성", colorClass: "p-mars", radius: "3,390 km", mass: "6.42e23 kg", distance: 170, period: 30.0 },
  { name: "목성", colorClass: "p-jupiter", radius: "69,911 km", mass: "1.90e27 kg", distance: 230, period: 120.0 },
  { name: "토성", colorClass: "p-saturn", radius: "58,232 km", mass: "5.68e26 kg", distance: 290, period: 250.0 },
];

function App() {

  <Global
    styles={css`
      @font-face {
        font-family: 'Daeojamjil';
        src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_2302_01@1.0/TheJamsil3Regular.woff2') format('woff2');
        font-weight: 400;
        font-display: swap;
      }
    `}
  />

  const Title = styled.h1`
    font-family: 'Daeojamjil';
    font-size: 28px;
  `;

  const Universe = styled.div`
    position: relative;
    width: 870px;
    height: 700px;
    border-radius: 50%;
  `;

  const Panel = styled.div`
    background: #fff;
    border-radius: var(--radius);
    padding: 16px;
    box-shadow: 0 6px 18px rgba(74, 89, 116, 0.15);
    width:350px;
    border: 1px solid rgb(97, 97, 97);
  `;

  const HomeButtons = styled.div``;

  const [view, setView] = useState("home");
  const [selectedPlanets, setSelectedPlanets] = useState([]);
  const [speed, setSpeed] = useState(1); // 슬라이더 상태 추가

  const handlePlanetClick = (planetName) => {
    const planet = planetData.find((p) => p.name === planetName);
    if (!planet) return;

    if (view === "single") {
      setSelectedPlanets([planet]);
    } else if (view === "multi") {
      setSelectedPlanets((prev) => {
        const exists = prev.find((p) => p.name === planetName);
        return exists ? prev.filter((p) => p.name !== planetName) : [...prev, planet];
      });
    } else if (view === "home") {
      setView("single");
      setSelectedPlanets([planet]);
    }
  };

  return (
    <div className="app page">
      <header>
        <div className="title">
          <div className="sun-icon">☀️</div>
          <div>
            <Title>행성비교</Title>
            <p className="subtitle">공전 시각화 · 행성 조회 · 비교</p>
          </div>
        </div>
      </header>

      <div className="layout">
        <section className="viewport-card">
          <div className="universe-wrap">
            <Universe>
              {/* --- 속도 조절 슬라이더 추가 --- */}
              <div style={{ position: "absolute", top: "10px", left: "50%", transform: "translateX(-50%)", zIndex: 10, color: "#fff" }}>
                <label>속도: </label>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(e.target.value)}
                />
                <span>{speed}x</span>
              </div>

              <div className="sun"></div>

              {planetData.map((p) => {
                const isSelected = selectedPlanets.some((sp) => sp.name === p.name);
                return (
                  <div
                    key={p.name}
                    className="orbiter"
                    style={{ animationDuration: `${p.period / speed}s` }} // 속도 반영
                  >
                    <div
                      className={`planet ${p.colorClass} ${isSelected ? "selected" : ""}`}
                      style={{ "--distance": `${p.distance}px` }}
                      onClick={() => handlePlanetClick(p.name)}
                      title={p.name}
                    ></div>
                  </div>
                );
              })}
            </Universe>
          </div>
        </section>

        <Panel>
          {view !== "home" && (
            <button className="back-btn" onClick={() => { setView("home"); setSelectedPlanets([]); }}>
              홈으로
            </button>
          )}
          {view === "home" && (
            <HomeButtons>
              <h2>단일 / 다중 행성 조회</h2>
              <button onClick={() => setView("single")} style={{marginRight:'10px'}}>단일 조회</button>
              <button onClick={() => setView("multi")}>다중 조회</button>
            </HomeButtons>
          )}

          {selectedPlanets.length > 0 && (
            <div className="info-card">
              {selectedPlanets.map((planet) => (
                <div key={planet.name} className="planet-info">
                  <div className="planet-preview">
                    <div className={`dot ${planet.colorClass}`}></div>
                  </div>
                  <div className="meta">
                    <div className="m-row"><strong>{planet.name}</strong></div>
                    <div className="m-row"><span>반지름:</span> {planet.radius}</div>
                    <div className="m-row"><span>질량:</span> {planet.mass}</div>
                    <div className="m-row"><span>거리:</span> {planet.distance}px</div>
                    <div className="m-row"><span>공전주기:</span> {planet.period}s</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

export default App;
