const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const cardRoutes = require('./routes/cards');
const deckRoutes = require('./routes/decks');
const battleRoutes = require('./routes/battles');
const gachaRoutes = require('./routes/gacha');
const rankingRoutes = require('./routes/ranking');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');

const { connectRedis } = require('./config/redis');
const { errorHandler } = require('./middleware/errorHandler');
const { setupSwagger } = require('./config/swagger');

const app = express();

// 미들웨어 설정
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100 // 요청 제한
});
app.use(limiter);

// MongoDB 연결
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('🍃 MongoDB 연결 성공'))
.catch(err => console.error('MongoDB 연결 실패:', err));

// Redis 연결
connectRedis();

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/decks', deckRoutes);
app.use('/api/battles', battleRoutes);
app.use('/api/gacha', gachaRoutes);
app.use('/api/ranking', rankingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Swagger 설정
setupSwagger(app);

// 에러 처리 미들웨어
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 서버 시작: http://localhost:${PORT}`);
  console.log(`📚 API 문서: http://localhost:${PORT}/api-docs`);
});

module.exports = app;