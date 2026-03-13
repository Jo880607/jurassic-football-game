const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 30
  },
  cards: [{
    userCardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserCard',
      required: true
    },
    position: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  }],
  totalCost: {
    type: Number,
    default: 0
  },
  isActive: { type: Boolean, default: false }, // 현재 사용중인 덱
  presetType: {
    type: String,
    enum: ['custom', 'aggressive', 'defensive', 'balanced'],
    default: 'custom'
  }
}, {
  timestamps: true,
  versionKey: false
});

// 덱 검증 미들웨어
deckSchema.pre('save', async function(next) {
  // 카드 수 체크 (최대 5장)
  if (this.cards.length > 5) {
    return next(new Error('덱에는 최대 5장의 카드만 포함할 수 있습니다'));
  }
  
  // 총 코스트 계산
  let totalCost = 0;
  for (let card of this.cards) {
    const UserCard = mongoose.model('UserCard');
    const userCard = await UserCard.findById(card.userCardId).populate('cardId');
    if (userCard) {
      totalCost += userCard.cardId.cost;
    }
  }
  
  this.totalCost = totalCost;
  
  // 코스트 제한 체크 (최대 15)
  if (this.totalCost > 15) {
    return next(new Error('덱의 총 코스트는 15를 초과할 수 없습니다'));
  }
  
  next();
});

module.exports = mongoose.model('Deck', deckSchema);