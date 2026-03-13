const mongoose = require('mongoose');

const battleSchema = new mongoose.Schema({
  battleId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  
  // 배틀 참가자
  player1: {
    userId: { type: String, required: true, ref: 'User' },
    deck: [{ 
      cardId: Number, 
      level: Number, 
      enhancement: Number,
      attack: Number,
      health: Number,
      speed: Number 
    }],
    totalPower: { type: Number, required: true }
  },
  
  player2: {
    userId: { type: String, required: true, ref: 'User' },
    deck: [{ 
      cardId: Number, 
      level: Number, 
      enhancement: Number,
      attack: Number,
      health: Number,
      speed: Number 
    }],
    totalPower: { type: Number, required: true }
  },
  
  // 배틀 결과
  winner: { type: String, enum: ['player1', 'player2', 'draw'] },
  battleLog: [{
    turn: Number,
    action: String,
    cardId: Number,
    damage: Number,
    remainingHealth: Number
  }],
  
  // 보상
  rewards: {
    winner: {
      exp: { type: Number, default: 0 },
      goldCoin: { type: Number, default: 0 },
      ratingChange: { type: Number, default: 0 }
    },
    loser: {
      exp: { type: Number, default: 0 },
      goldCoin: { type: Number, default: 0 },
      ratingChange: { type: Number, default: 0 }
    }
  },
  
  battleType: { 
    type: String, 
    enum: ['RANKED', 'CASUAL', 'TOURNAMENT'],
    required: true 
  },
  
  duration: { type: Number }, // 초 단위
  status: { 
    type: String, 
    enum: ['WAITING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    default: 'WAITING'
  }
}, {
  timestamps: true,
  versionKey: false
});

battleSchema.index({ 'player1.userId': 1, createdAt: -1 });
battleSchema.index({ 'player2.userId': 1, createdAt: -1 });
battleSchema.index({ battleType: 1, status: 1 });

module.exports = mongoose.model('Battle', battleSchema);