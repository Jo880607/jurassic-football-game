const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() { return !this.socialId; } // 소셜로그인시 비밀번호 불필요
  },
  nickname: {
    type: String,
    required: true,
    maxlength: 20
  },
  level: {
    type: Number,
    default: 1
  },
  exp: {
    type: Number,
    default: 0
  },
  coins: {
    type: Number,
    default: 1000
  },
  diamonds: {
    type: Number,
    default: 100
  },
  rankPoints: {
    type: Number,
    default: 1000
  },
  currentRank: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Master'],
    default: 'Bronze'
  },
  // 소셜 로그인
  socialId: String,
  socialProvider: {
    type: String,
    enum: ['google', 'apple']
  },
  // 뽑기 천장 시스템
  gachaPity: {
    normalCount: { type: Number, default: 0 },
    premiumCount: { type: Number, default: 0 },
    legendaryCount: { type: Number, default: 0 }
  },
  // 일일 미션
  dailyMissions: [{
    missionId: String,
    completed: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
    resetAt: Date
  }],
  // 계정 설정
  settings: {
    soundEnabled: { type: Boolean, default: true },
    notificationEnabled: { type: Boolean, default: true },
    language: { type: String, default: 'ko' }
  },
  lastLoginAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
  versionKey: false
});

// 비밀번호 해시화
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// 비밀번호 검증 메소드
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 레벨업 체크 메소드
userSchema.methods.checkLevelUp = function() {
  const requiredExp = this.level * 100; // 레벨당 100 경험치 필요
  if (this.exp >= requiredExp) {
    this.level += 1;
    this.exp -= requiredExp;
    return true;
  }
  return false;
};

module.exports = mongoose.model('User', userSchema);