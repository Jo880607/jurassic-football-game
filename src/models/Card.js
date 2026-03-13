const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  cardId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  rarity: {
    type: String,
    enum: ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary'],
    required: true
  },
  type: {
    type: String,
    enum: ['Carnivore', 'Herbivore', 'Omnivore', 'Flying', 'Marine'],
    required: true
  },
  cost: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  attack: {
    type: Number,
    required: true
  },
  health: {
    type: Number,
    required: true
  },
  abilities: [{
    name: String,
    description: String,
    effectType: String, // damage, heal, buff, debuff
    effectValue: Number
  }],
  imageUrl: String,
  animationUrl: String,
  // 뽑기 확률 (10000 분율로 관리)
  dropRate: {
    normal: { type: Number, default: 0 },
    premium: { type: Number, default: 0 },
    legendary: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true },
  releaseDate: { type: Date, default: Date.now }
}, {
  timestamps: true,
  versionKey: false
});

// 인덱스 설정
cardSchema.index({ rarity: 1, type: 1 });
cardSchema.index({ isActive: 1 });

module.exports = mongoose.model('Card', cardSchema);