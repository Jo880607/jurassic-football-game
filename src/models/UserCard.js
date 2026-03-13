const mongoose = require('mongoose');

const userCardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cardId: {
    type: Number,
    required: true
  },
  level: {
    type: Number,
    default: 1,
    min: 1,
    max: 50
  },
  enhancementLevel: {
    type: Number,
    default: 0,
    min: 0,
    max: 10
  },
  // 강화 재료로 사용된 중복 카드 수
  duplicateCount: {
    type: Number,
    default: 0
  },
  isInDeck: { type: Boolean, default: false },
  obtainedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  versionKey: false
});

// 복합 인덱스
userCardSchema.index({ userId: 1, cardId: 1 });
userCardSchema.index({ userId: 1, isInDeck: 1 });

// 카드 스탯 계산 메소드
userCardSchema.methods.getStats = async function() {
  const Card = mongoose.model('Card');
  const cardData = await Card.findOne({ cardId: this.cardId });
  
  if (!cardData) throw new Error('카드 데이터를 찾을 수 없습니다');
  
  // 레벨과 강화 수치로 스탯 계산
  const levelMultiplier = 1 + (this.level - 1) * 0.1;
  const enhanceMultiplier = 1 + this.enhancementLevel * 0.05;
  
  return {
    attack: Math.floor(cardData.attack * levelMultiplier * enhanceMultiplier),
    health: Math.floor(cardData.health * levelMultiplier * enhanceMultiplier),
    cost: cardData.cost
  };
};

module.exports = mongoose.model('UserCard', userCardSchema);