const mongoose = require('mongoose');

// 카드 마스터 데이터
const cardMasterSchema = new mongoose.Schema({
  cardId: { type: Number, required: true, unique: true },
  cardName: { type: String, required: true },
  rarity: { 
    type: String, 
    enum: ['COMMON', 'RARE', 'EPIC', 'LEGENDARY'],
    required: true 
  },
  
  // 기본 스탯 (레벨 1 기준)
  baseAttack: { type: Number, required: true, min: 1 },
  baseHealth: { type: Number, required: true, min: 1 },
  baseSpeed: { type: Number, required: true, min: 1 },
  
  // 스킬 정보
  skill: {
    skillId: { type: Number, required: true },
    skillName: { type: String, required: true },
    description: { type: String, required: true },
    cooldown: { type: Number, default: 3 },
    power: { type: Number, default: 100 }
  },
  
  // 이미지 및 메타데이터
  imageUrl: { type: String, required: true },
  description: { type: String, default: '' },
  isEnabled: { type: Boolean, default: true },
  
  // 뽑기 가중치
  dropWeight: {
    normal: { type: Number, default: 1 },
    premium: { type: Number, default: 1 }
  }
}, {
  timestamps: true,
  versionKey: false
});

// 유저가 보유한 카드
const userCardSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: 'User' },
  cardId: { type: Number, required: true, ref: 'CardMaster' },
  
  // 강화 정보
  level: { type: Number, default: 1, min: 1, max: 60 },
  enhancement: { type: Number, default: 0, min: 0, max: 10 }, // +0 ~ +10
  
  // 계산된 최종 스탯
  finalAttack: { type: Number, required: true },
  finalHealth: { type: Number, required: true },
  finalSpeed: { type: Number, required: true },
  
  // 획득 정보
  obtainedAt: { type: Date, default: Date.now },
  obtainMethod: { 
    type: String, 
    enum: ['GACHA_NORMAL', 'GACHA_PREMIUM', 'SHOP', 'EVENT', 'QUEST'],
    required: true 
  },
  
  // 덱 편성 관련
  isInDeck: { type: Boolean, default: false },
  deckPosition: { type: Number, min: 1, max: 5 }
}, {
  timestamps: true,
  versionKey: false
});

// 복합 인덱스
userCardSchema.index({ userId: 1, cardId: 1 });
userCardSchema.index({ userId: 1, isInDeck: 1 });

const CardMaster = mongoose.model('CardMaster', cardMasterSchema);
const UserCard = mongoose.model('UserCard', userCardSchema);

module.exports = { CardMaster, UserCard };