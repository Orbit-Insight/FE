import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../dist');

app.use(cors());
app.use(express.json());
app.use(express.static(distPath));

app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

const users = [
  { username: 'astro', password: 'planet123', name: '행성탐험가' },
];

const planets = [
  {
    id: 'mercury',
    name: '수성',
    colorClass: 'p-mercury',
    radius: '2,439 km',
    mass: '3.3e23 kg',
    distance: 60,
    period: 4.15,
    description: '태양에 가장 가까운 가장 작은 행성으로 낮과 밤의 온도 차가 매우 큽니다.',
  },
  {
    id: 'venus',
    name: '금성',
    colorClass: 'p-venus',
    radius: '6,052 km',
    mass: '4.87e24 kg',
    distance: 90,
    period: 10.3,
    description: '짙은 이산화탄소 대기로 뒤덮인 뜨거운 행성으로 온실효과가 극심합니다.',
  },
  {
    id: 'earth',
    name: '지구',
    colorClass: 'p-earth',
    radius: '6,371 km',
    mass: '5.97e24 kg',
    distance: 130,
    period: 16.0,
    description: '액체 상태의 물과 대기를 지닌 우리가 사는 행성입니다.',
  },
  {
    id: 'mars',
    name: '화성',
    colorClass: 'p-mars',
    radius: '3,390 km',
    mass: '6.42e23 kg',
    distance: 170,
    period: 30.0,
    description: '붉은 모래와 거대한 화산, 협곡을 가진 차가운 사막 행성입니다.',
  },
  {
    id: 'jupiter',
    name: '목성',
    colorClass: 'p-jupiter',
    radius: '69,911 km',
    mass: '1.90e27 kg',
    distance: 230,
    period: 120.0,
    description: '가장 큰 가스 행성으로 거대한 대적점이 유명합니다.',
  },
  {
    id: 'saturn',
    name: '토성',
    colorClass: 'p-saturn',
    radius: '58,232 km',
    mass: '5.68e26 kg',
    distance: 290,
    period: 250.0,
    description: '아름다운 고리로 둘러싸인 가스 행성입니다.',
  },
  {
    id: 'uranus',
    name: '천왕성',
    colorClass: 'p-uranus',
    radius: '25,362 km',
    mass: '8.68e25 kg',
    distance: 340,
    period: 370.0,
    description: '자전축이 98도 기울어져 옆으로 누운 독특한 가스 행성입니다.',
  },
  {
    id: 'neptune',
    name: '해왕성',
    colorClass: 'p-neptune',
    radius: '24,622 km',
    mass: '1.02e26 kg',
    distance: 380,
    period: 480.0,
    description: '강한 바람과 폭풍이 특징인 푸른 가스 행성입니다.',
  },
  {
    id: 'pluto',
    name: '명왕성',
    colorClass: 'p-pluto',
    radius: '1,188 km',
    mass: '1.31e22 kg',
    distance: 410,
    period: 600.0,
    description: '왜행성이지만 태양계 외곽의 흥미로운 천체입니다.',
  },
];

app.get('/', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Planet API server',
    endpoints: ['/health', '/api/planets', '/api/planets/:id'],
  });
});

app.get('/api', (_req, res) => {
  res.json({
    status: 'ok',
    endpoints: ['/api/planets', '/api/planets/:id'],
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  return res.json({
    token: 'dummy-token',
    user: { username: user.username, name: user.name },
  });
});

app.post('/api/auth/signup', (req, res) => {
  const { username, password, name } = req.body || {};
  if (!username || !password || !name) {
    return res.status(400).json({ error: 'username, password, name are required' });
  }
  const exists = users.find((u) => u.username === username);
  if (exists) {
    return res.status(409).json({ error: 'User already exists' });
  }
  users.push({ username, password, name });
  return res.json({
    token: 'dummy-token',
    user: { username, name },
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/api/planets', (_req, res) => {
  res.json(planets);
});

app.get('/api/planets/:id', (req, res) => {
  const planet = planets.find((p) => p.id === req.params.id);
  if (!planet) {
    return res.status(404).json({ error: 'Planet not found' });
  }
  return res.json(planet);
});

// SPA fallback: serve React app for non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
