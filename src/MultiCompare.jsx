import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Stars } from "@react-three/drei";
import styled from "@emotion/styled";

const planets = [
  { name: "수성", size: 0.3, color: "#aaa", speed: 0.02, info: { radius: "2,439 km", mass: "3.3×10²³ kg", distance: "57.9M km" } },
  { name: "금성", size: 0.6, color: "#f5e1a4", speed: 0.015, info: { radius: "6,052 km", mass: "4.87×10²⁴ kg", distance: "108.2M km" } },
  { name: "지구", size: 0.65, color: "#4f8cff", speed: 0.01, info: { radius: "6,371 km", mass: "5.97×10²⁴ kg", distance: "149.6M km" } },
  { name: "화성", size: 0.45, color: "#ff4f4f", speed: 0.008, info: { radius: "3,390 km", mass: "6.42×10²³ kg", distance: "227.9M km" } },
  { name: "목성", size: 1.2, color: "#d9b27c", speed: 0.005, info: { radius: "69,911 km", mass: "1.90×10²⁷ kg", distance: "778.5M km" } },
  { name: "토성", size: 1.0, color: "#f5d97a", speed: 0.004, info: { radius: "58,232 km", mass: "5.68×10²⁶ kg", distance: "1.43B km" } },
  { name: "천왕성", size: 0.7, color: "#7fffd4", speed: 0.003, info: { radius: "25,362 km", mass: "8.68×10²⁵ kg", distance: "2.87B km" } },
  { name: "해왕성", size: 0.68, color: "#4b60ff", speed: 0.002, info: { radius: "24,622 km", mass: "1.02×10²⁶ kg", distance: "4.50B km" } },
];

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  padding: 40px 20px;
  color: white;
`;

const Header = styled.div`
  max-width: 1400px;
  margin: 0 auto 40px;
  display: flex;
  align-items: center;
  gap: 20px;
`;

const BackButton = styled.button`
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateX(-4px);
    box-shadow: 0 4px 20px rgba(255, 255, 255, 0.2);
  }
`;

const Title = styled.h1`
  font-size: 42px;
  margin: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Content = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const SelectionPanel = styled.div`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 24px;
  padding: 32px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin-bottom: 40px;
  display: flex;
  gap: 24px;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SelectWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SelectLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const PlanetSelect = styled.select`
  width: 100%;
  padding: 16px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  
  option {
    background: #2d2d44;
    color: white;
  }
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
  }
  
  &:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
  }
`;

const VSIcon = styled.div`
  font-size: 32px;
  font-weight: 800;
  color: #667eea;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    transform: rotate(90deg);
  }
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 40px;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const PlanetCard = styled.div`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border-radius: 24px;
  padding: 32px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
`;

const PlanetName = styled.h2`
  font-size: 32px;
  margin: 0 0 24px;
  text-align: center;
  background: linear-gradient(135deg, #ffffff 0%, ${props => props.color} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CanvasWrapper = styled.div`
  height: 350px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  margin-bottom: 24px;
  overflow: hidden;
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 12px;
`;

const InfoRow = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 14px 18px;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(4px);
  }
`;

const InfoLabel = styled.span`
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 500;
`;

const InfoValue = styled.span`
  color: white;
  font-size: 15px;
  font-weight: 600;
`;

const ComparisonBadge = styled.div`
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  margin-top: 40px;
  border: 1px solid rgba(102, 126, 234, 0.4);
`;

const ComparisonText = styled.p`
  font-size: 18px;
  margin: 0;
  color: white;
  font-weight: 500;
`;

function Planet({ color, size, speed }) {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += speed;
    }
  });

  return (
    <Sphere ref={meshRef} args={[size, 64, 64]}>
      <meshStandardMaterial 
        color={color} 
        roughness={0.3}
        metalness={0.6}
      />
    </Sphere>
  );
}

export default function MultiCompare({ goBack }) {
  const [planet1, setPlanet1] = useState(planets[2]);
  const [planet2, setPlanet2] = useState(planets[3]);

  const getSizeComparison = () => {
    const ratio = (planet1.size / planet2.size).toFixed(2);
    if (ratio > 1) {
      return `${planet1.name}이(가) ${planet2.name}보다 ${ratio}배 큽니다`;
    } else {
      return `${planet2.name}이(가) ${planet1.name}보다 ${(1/ratio).toFixed(2)}배 큽니다`;
    }
  };

  return (
    <Container>
      <Header>
        <BackButton onClick={goBack}>← 뒤로가기</BackButton>
        <Title>행성 비교 분석</Title>
      </Header>

      <Content>
        <SelectionPanel>
          <SelectWrapper>
            <SelectLabel>첫 번째 행성</SelectLabel>
            <PlanetSelect
              onChange={(e) => setPlanet1(planets[e.target.value])}
              value={planets.indexOf(planet1)}
            >
              {planets.map((p, i) => (
                <option key={p.name} value={i}>{p.name}</option>
              ))}
            </PlanetSelect>
          </SelectWrapper>

          <VSIcon>VS</VSIcon>

          <SelectWrapper>
            <SelectLabel>두 번째 행성</SelectLabel>
            <PlanetSelect
              onChange={(e) => setPlanet2(planets[e.target.value])}
              value={planets.indexOf(planet2)}
            >
              {planets.map((p, i) => (
                <option key={p.name} value={i}>{p.name}</option>
              ))}
            </PlanetSelect>
          </SelectWrapper>
        </SelectionPanel>

        <ComparisonGrid>
          {[planet1, planet2].map((planet) => (
            <PlanetCard key={planet.name}>
              <PlanetName color={planet.color}>{planet.name}</PlanetName>
              
              <CanvasWrapper>
                <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
                  <Stars radius={200} depth={50} count={3000} factor={5} saturation={0} fade />
                  <ambientLight intensity={0.4} />
                  <pointLight position={[10, 10, 10]} intensity={1.5} />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} color="#667eea" />
                  <Planet color={planet.color} size={planet.size} speed={planet.speed} />
                  <OrbitControls 
                    enableZoom={true}
                    enablePan={false}
                    minDistance={2}
                    maxDistance={8}
                  />
                </Canvas>
              </CanvasWrapper>

              <InfoGrid>
                <InfoRow>
                  <InfoLabel>반지름</InfoLabel>
                  <InfoValue>{planet.info.radius}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>질량</InfoLabel>
                  <InfoValue>{planet.info.mass}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>태양으로부터 거리</InfoLabel>
                  <InfoValue>{planet.info.distance}</InfoValue>
                </InfoRow>
                <InfoRow>
                  <InfoLabel>상대 크기</InfoLabel>
                  <InfoValue>{planet.size.toFixed(2)}</InfoValue>
                </InfoRow>
              </InfoGrid>
            </PlanetCard>
          ))}
        </ComparisonGrid>

        <ComparisonBadge>
          <ComparisonText>📊 {getSizeComparison()}</ComparisonText>
        </ComparisonBadge>
      </Content>
    </Container>
  );
}