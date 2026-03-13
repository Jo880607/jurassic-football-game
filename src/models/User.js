const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  email: { type: String, required: true, unique: true },
  nickname: { type: String, required: true, maxLength: 20 },
  profileImage: { type: String, default: '' },
  
  // 게임 진행도
  level: { type: Number, default: 1, min: 1, max: 100 },
  exp: { type: Number, default: 0, min: 0 },
  
  // 재화
  pumpkinCoin: { type: Number, default: 500, min: 0 }, // 유료재화
  goldCoin: { type: Number, default: 1000, min: 0 },   // 무료재화
  
  // 뽑기 천장 시스템
  gachaPity: {
    normal: { type: Number, default: 0, max: 10 },     // 일반뽑기 천장
    premium: { type: Number, default: 0, max: 90 },    // 프리미엄뽑기 천장
    lastLegendaryAt: { type: Date, default: null }
  },
  
  // 랭킹 정보
  battleRating: { type: Number, default: 1000 },
  league: { 
    type: String, 
    enum: ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM', 'DIAMOND'], 
    default: 'BRONZE' 
  },
  
  // 계정 상태
  isActive: { type: Boolean, default: true },
  isBanned: { type: Boolean, default: false },
  banReason: { type: String, default: '' },
  lastLoginAt: { type: Date, default: Date.now },
  
  // 설정
  settings: {
    soundEnabled: { type: Boolean, default: true },
    notificationEnabled: { type: Boolean, default: true },
    language: { type: String, enum: ['ko', 'en', 'ja'], default: 'ko' }
  }
}, {
  timestamps: true,
  versionKey: false
});

// 인덱스 설정
userSchema.index({ email: 1 });
userSchema.index({ battleRating: -1 });
userSchema.index({ league: 1, battleRating: -1 });

module.exports = mongoose.model('User', userSchema);