import { useState, useEffect } from "react";
import "./App.css";
import { Global, css } from "@emotion/react";
import styled from "@emotion/styled";
import LogoImg from "./assets/Logo.svg";

const defaultPlanets = [
  { id: "mercury", name: "수성", colorClass: "p-mercury", radius: "2,439 km", mass: "3.3e23 kg", distance: 60, period: 4.15 },
  { id: "venus", name: "금성", colorClass: "p-venus", radius: "6,052 km", mass: "4.87e24 kg", distance: 90, period: 10.3 },
  { id: "earth", name: "지구", colorClass: "p-earth", radius: "6,371 km", mass: "5.97e24 kg", distance: 130, period: 16.0 },
  { id: "mars", name: "화성", colorClass: "p-mars", radius: "3,390 km", mass: "6.42e23 kg", distance: 170, period: 30.0 },
  { id: "jupiter", name: "목성", colorClass: "p-jupiter", radius: "69,911 km", mass: "1.90e27 kg", distance: 230, period: 120.0 },
  { id: "saturn", name: "토성", colorClass: "p-saturn", radius: "58,232 km", mass: "5.68e26 kg", distance: 290, period: 250.0 },
  { id: "uranus", name: "천왕성", colorClass: "p-uranus", radius: "25,362 km", mass: "8.68e25 kg", distance: 340, period: 370.0 },
  { id: "neptune", name: "해왕성", colorClass: "p-neptune", radius: "24,622 km", mass: "1.02e26 kg", distance: 380, period: 480.0 },
  { id: "pluto", name: "명왕성", colorClass: "p-pluto", radius: "1,188 km", mass: "1.31e22 kg", distance: 410, period: 600.0 },
];

const Header = styled.div`
  width: 1300px;
  margin-left:30px;
`;

const Title = styled.h1`
  font-family: 'Daeojamjil';
  font-size: 32px;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Universe = styled.div`
  position: relative;
  width: 870px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(ellipse at center, rgba(20, 20, 40, 0.3) 0%, rgba(10, 10, 20, 0.6) 100%);
`;

const Panel = styled.div`
  background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.06);
  width: 350px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
`;

const LoginButton = styled.button`
  width: 110px;
  height: 44px;
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 22px;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  right: 0px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    color: #fff;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const HistoryButton = styled.button`
  width: 100%;
  padding: 14px;
  border: 2px solid ${props => props.showHistory ? "transparent" : "#e0e0e0"};
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  background: ${props => !props.isLoggedIn ? "#f5f5f5" : (props.showHistory ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#fff")};
  color: ${props => !props.isLoggedIn ? "#999" : (props.showHistory ? "#fff" : "#333")};
  cursor: ${props => !props.isLoggedIn ? "not-allowed" : "pointer"};
  opacity: ${props => !props.isLoggedIn ? 0.6 : 1};
  box-shadow: ${props => props.showHistory ? "0 4px 15px rgba(102, 126, 234, 0.3)" : "none"};
  
  &:hover:not(:disabled) {
    transform: ${props => props.isLoggedIn ? "translateY(-2px)" : "none"};
    box-shadow: ${props => props.showHistory ? "0 6px 20px rgba(102, 126, 234, 0.4)" : "0 2px 8px rgba(0,0,0,0.1)"};
    color: gray;
  }
`;

const SpeedControl = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 12px;
  color: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  label {
    margin-right: 12px;
    font-weight: 500;
  }
  
  input[type="range"] {
    accent-color: #667eea;
  }
  
  span {
    margin-left: 12px;
    font-weight: 600;
    color: #667eea;
  }
`;

const FullscreenButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;
  width: 44px;
  height: 44px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  
  &:hover {
    background: rgba(0, 0, 0, 0.85);
    border-color: #667eea;
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const FullscreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  background: #0a0a15;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const FullscreenUniverse = styled(Universe)`
  width: 90vmin;
  height: 90vmin;
  max-width: 1200px;
  max-height: 1200px;
`;

const HistorySection = styled.div`
  margin-bottom: 18px;
  
  h3 {
    margin-bottom: 8px;
    font-size: 16px;
  }
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const HistoryItem = styled.div`
  font-size: 13px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e9ecef;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(4px);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
    border-color: #667eea;
  }
  
  .planet-name {
    font-weight: 600;
    color: #333;
  }
  
  .timestamp {
    color: #999;
    font-size: 11px;
  }
`;

const EmptyHistory = styled.div`
  margin-bottom: 18px;
  padding: 24px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 12px;
  text-align: center;
  color: #999;
  border: 2px dashed #e0e0e0;
`;

const ButtonGroup = styled.div`
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
`;

const ViewButton = styled.button`
  flex: 1;
  padding: 14px;
  border: 2px solid ${props => props.active ? "transparent" : "#e0e0e0"};
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.active ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" : "#fff"};
  color: ${props => props.active ? "#fff" : "#333"};
  box-shadow: ${props => props.active ? "0 4px 15px rgba(102, 126, 234, 0.3)" : "none"};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.active ? "0 6px 20px rgba(102, 126, 234, 0.4)" : "0 2px 8px rgba(0,0,0,0.1)"};
    color: ${props => props.active ? "white" : "gray"};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const BackButton = styled.button`
  width: 100%;
  margin-top: 12px;
  padding: 14px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  color: #333;
  bottom:0px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    border-color: #667eea;
    color: #667eea;
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonContainer = styled.div`
  margin-bottom: 12px;
`;

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

const AuthActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 4px;
`;

const Input = styled.input`
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #667eea;
  }
`;

const ErrorText = styled.div`
  color: #d9534f;
  font-size: 13px;
`;

const SmallText = styled.div`
  font-size: 13px;
  color: #666;
  margin-top: 4px;
`;

const AuthToggle = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin: 10px 0 14px;
`;

const AuthTabButton = styled.button`
  flex: 1;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid ${({ active }) => (active ? '#667eea' : '#ddd')};
  background: ${({ active }) => (active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
`;

function App() {
  const apiBaseEnv = import.meta.env.VITE_API_URL || "http://localhost:4000/api";
  const normalizedBase = apiBaseEnv.endsWith("/") ? apiBaseEnv.slice(0, -1) : apiBaseEnv;
  const apiRoot = normalizedBase.endsWith("/api") ? normalizedBase : `${normalizedBase}/api`;
  const [view, setView] = useState("home");
  const [planets, setPlanets] = useState(defaultPlanets);
  const [selectedPlanets, setSelectedPlanets] = useState([]);
  const [speed, setSpeed] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [authMode, setAuthMode] = useState("login"); // login | signup
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [signupForm, setSignupForm] = useState({ username: "", password: "", name: "" });
  const [signupError, setSignupError] = useState("");

  useEffect(() => {
    const fetchPlanets = async () => {
      if (!apiRoot) return;
      try {
        const res = await fetch(`${apiRoot}/planets`);
        if (!res.ok) throw new Error(`Failed to fetch planets: ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setPlanets(data);
        }
      } catch (err) {
        console.error("행성 데이터를 불러오지 못했습니다.", err);
      }
    };

    fetchPlanets();
  }, [apiRoot]);

  useEffect(() => {
    const savedAuth = localStorage.getItem("planet-auth");
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed?.token && parsed?.user) {
          setAuthToken(parsed.token);
          setAuthUser(parsed.user);
          setIsLoggedIn(true);
          setShowLoginForm(false);
        }
      } catch (e) {
        console.error("Failed to parse saved auth", e);
      }
    }
  }, []);

  const formatDateTime = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${month}/${day} ${hours}:${minutes}`;
  };

  const pushHistory = (name) => {
    const now = new Date();
    setHistory((prev) => {
      const newEntry = {
        planet: name,
        timestamp: now,
        formatted: formatDateTime(now)
      };
      const updated = [newEntry, ...prev];
      return updated.slice(0, 10);
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setSignupError("");
    setAuthLoading(true);
    try {
      const res = await fetch(`${apiRoot}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      if (!res.ok) {
        throw new Error(`Login failed: ${res.status}`);
      }
      const data = await res.json();
      setAuthUser(data.user);
      setAuthToken(data.token);
      setIsLoggedIn(true);
      setShowLoginForm(false);
      localStorage.setItem("planet-auth", JSON.stringify({ token: data.token, user: data.user }));
      setLoginForm({ username: "", password: "" });
    } catch (err) {
      console.error(err);
      setLoginError("아이디/비밀번호를 확인해주세요.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setSignupError("");
    setLoginError("");
    setAuthLoading(true);
    try {
      const res = await fetch(`${apiRoot}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupForm),
      });
      if (!res.ok) {
        if (res.status === 409) throw new Error("already exists");
        throw new Error(`Signup failed: ${res.status}`);
      }
      const data = await res.json();
      setAuthUser(data.user);
      setAuthToken(data.token);
      setIsLoggedIn(true);
      setShowLoginForm(false);
      setAuthMode("login");
      localStorage.setItem("planet-auth", JSON.stringify({ token: data.token, user: data.user }));
      setSignupForm({ username: "", password: "", name: "" });
    } catch (err) {
      console.error(err);
      if (err.message.includes("already exists")) {
        setSignupError("이미 존재하는 아이디입니다.");
      } else {
        setSignupError("가입에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setAuthUser(null);
    setAuthToken(null);
    setIsLoggedIn(false);
    setShowHistory(false);
    setShowLoginForm(true);
    localStorage.removeItem("planet-auth");
  };

  const handlePlanetClick = (planetName) => {
    const planet = planets.find((p) => p.name === planetName);
    if (!planet) return;

    pushHistory(planetName);

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

  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn);
    if (isLoggedIn) {
      setShowHistory(false);
    }
  };

  const renderUniverse = () => (
    <>
      <SpeedControl>
        <label>속도&nbsp;</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
        />
        <span>{speed}x</span>
      </SpeedControl>

      <FullscreenButton onClick={() => setIsFullscreen(!isFullscreen)}>
        {isFullscreen ? "✕" : "⛶"}
      </FullscreenButton>

      <div className="sun"></div>

      {planets.map((p) => {
        const isSelected = selectedPlanets.some((sp) => sp.name === p.name);
        return (
          <div
            key={p.name}
            className="orbiter"
            style={{ animationDuration: `${p.period / speed}s` }}
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
    </>
  );

  return (
    <>
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
      
      <div className="app page">
        <Header>
          <div className="title">
            <HeaderContainer>
              <HeaderLeft>
                
                <div>
                  <img src={LogoImg}></img>
                  <Title> 행성비교 ☀️ </Title>
                  
                  <p className="subtitle">공전 시각화 · 행성 조회 · 비교</p>
                
                </div>
              </HeaderLeft>
              
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {isLoggedIn && authUser && (
                  <div style={{ textAlign: "right", fontSize: "13px" }}>
                    <div>{authUser.name}</div>
                    <div style={{ color: "#666" }}>{authUser.username}</div>
                  </div>
                )}
                <LoginButton onClick={() => {
                  if (isLoggedIn) {
                    handleLogout();
                  } else {
                    setShowLoginForm(true);
                  }
                }}>
                  {isLoggedIn ? "로그아웃" : "로그인/가입"}
                </LoginButton>
              </div>
            </HeaderContainer>
          </div>
        </Header>

        <div className="layout">
          <section className="viewport-card">
            <div className="universe-wrap">
              <Universe>
                {renderUniverse()}
              </Universe>
            </div>
          </section>

          <Panel>
            {!isLoggedIn && showLoginForm && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontWeight: 700 }}>로그인 / 회원가입</div>
                <AuthToggle>
                  <AuthTabButton
                    type="button"
                    active={authMode === "login"}
                    onClick={() => { setAuthMode("login"); setLoginError(""); setSignupError(""); }}
                  >
                    로그인
                  </AuthTabButton>
                  <AuthTabButton
                    type="button"
                    active={authMode === "signup"}
                    onClick={() => { setAuthMode("signup"); setLoginError(""); setSignupError(""); }}
                  >
                    회원가입
                  </AuthTabButton>
                </AuthToggle>

                {authMode === "login" && (
                  <AuthForm onSubmit={handleLoginSubmit}>
                    <Input
                      type="text"
                      placeholder="아이디 (astro)"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                    />
                    <Input
                      type="password"
                      placeholder="비밀번호 (planet123)"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                    />
                    {loginError && <ErrorText>{loginError}</ErrorText>}
                    <AuthActions>
                      <LoginButton type="submit" disabled={authLoading}>
                        {authLoading ? "진행 중..." : "로그인"}
                      </LoginButton>
                    </AuthActions>
                    <SmallText>데모 계정: astro / planet123</SmallText>
                  </AuthForm>
                )}

                {authMode === "signup" && (
                  <AuthForm onSubmit={handleSignupSubmit}>
                    <Input
                      type="text"
                      placeholder="아이디"
                      value={signupForm.username}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, username: e.target.value }))}
                    />
                    <Input
                      type="password"
                      placeholder="비밀번호"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                    />
                    <Input
                      type="text"
                      placeholder="이름/닉네임"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))}
                    />
                    {signupError && <ErrorText>{signupError}</ErrorText>}
                    <AuthActions>
                      <LoginButton type="submit" disabled={authLoading}>
                        {authLoading ? "진행 중..." : "가입하기"}
                      </LoginButton>
                    </AuthActions>
                  </AuthForm>
                )}
              </div>
            )}

            {isLoggedIn && authUser && (
              <div style={{ marginBottom: "16px" }}>
                <div style={{ fontWeight: 700 }}>안녕하세요, {authUser.name}님</div>
                <SmallText>조회 히스토리가 저장됩니다.</SmallText>
              </div>
            )}

            <ButtonContainer>
              <HistoryButton
                onClick={() => setShowHistory(!showHistory)}
                disabled={!isLoggedIn}
                isLoggedIn={isLoggedIn}
                showHistory={showHistory}
              >
                {showHistory ? "히스토리 닫기" : "조회 히스토리 보기"} {!isLoggedIn && "(로그인 필요)"}
              </HistoryButton>
            </ButtonContainer>

            {showHistory && isLoggedIn && history.length > 0 && (
              <HistorySection>
                <h3>조회 히스토리 (최근 10개)</h3>
                <HistoryList>
                  {history.map((item, i) => (
                    <HistoryItem key={i}>
                      <span className="planet-name">{item.planet}</span>
                      <span className="timestamp">{item.formatted}</span>
                    </HistoryItem>
                  ))}
                </HistoryList>
              </HistorySection>
            )}

            {showHistory && isLoggedIn && history.length === 0 && (
              <EmptyHistory>
                아직 조회한 행성이 없습니다.
              </EmptyHistory>
            )}

            <ButtonGroup>
              <ViewButton
                onClick={() => { setView("single"); setSelectedPlanets([]); }}
                active={view === "single"}
              >
                단일 조회
              </ViewButton>

              <ViewButton
                onClick={() => { setView("multi"); setSelectedPlanets([]); }}
                active={view === "multi"}
              >
                다중 조회
              </ViewButton>
            </ButtonGroup>

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

            {view !== "home" && (
              <BackButton
                onClick={() => { setView("home"); setSelectedPlanets([]); }}
              >
                홈으로
              </BackButton>
            )}
          </Panel>
        </div>

        {isFullscreen && (
          <FullscreenOverlay onClick={(e) => {
            if (e.target === e.currentTarget) setIsFullscreen(false);
          }}>
            <FullscreenUniverse>
              {renderUniverse()}
            </FullscreenUniverse>
          </FullscreenOverlay>
        )}
      </div>
    </>
  );
}

export default App;
