import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 유저 스토어
export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      coins: 1000,
      diamonds: 100,
      level: 1,
      exp: 0,
      rankPoints: 1000,

      // 재화 업데이트
      updateCoins: (amount) => set((state) => ({ 
        coins: Math.max(0, state.coins + amount) 
      })),
      
      updateDiamonds: (amount) => set((state) => ({ 
        diamonds: Math.max(0, state.diamonds + amount) 
      })),

      // 경험치 및 레벨업
      addExp: (amount) => set((state) => {
        const newExp = state.exp + amount;
        const expNeeded = state.level * 100;
        
        if (newExp >= expNeeded) {
          return {
            exp: newExp - expNeeded,
            level: state.level + 1,
          };
        }
        return { exp: newExp };
      }),

      // 로그인/로그아웃
      login: (userData) => set({ user: userData }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'dinokick-user',
    }
  )
);

// 카드 인벤토리 스토어
export const useInventoryStore = create(
  persist(
    (set, get) => ({
      cards: [],
      decks: {
        1: { name: '기본덱', cards: [] },
        2: { name: '공격덱', cards: [] },
        3: { name: '방어덱', cards: [] },
      },
      activeDeckId: 1,

      // 카드 추가
      addCard: (card) => set((state) => ({
        cards: [...state.cards, { ...card, id: Date.now() }]
      })),

      // 덱에 카드 추가/제거
      addCardToDeck: (deckId, cardId) => set((state) => {
        const deck = state.decks[deckId];
        if (deck.cards.length >= 5) return state;
        
        return {
          decks: {
            ...state.decks,
            [deckId]: {
              ...deck,
              cards: [...deck.cards, cardId]
            }
          }
        };
      }),

      removeCardFromDeck: (deckId, cardIndex) => set((state) => ({
        decks: {
          ...state.decks,
          [deckId]: {
            ...state.decks[deckId],
            cards: state.decks[deckId].cards.filter((_, i) => i !== cardIndex)
          }
        }
      })),

      // 활성 덱 변경
      setActiveDeck: (deckId) => set({ activeDeckId: deckId }),
    }),
    {
      name: 'dinokick-inventory',
    }
  )
);

// 배틀 스토어
export const useBattleStore = create((set, get) => ({
  battleState: 'idle', // idle, playing, paused, finished
  playerHP: 100,
  enemyHP: 100,
  playerMana: 3,
  enemyMana: 3,
  turn: 'player',
  handCards: [],
  fieldCards: { player: [], enemy: [] },

  // 배틀 시작
  startBattle: (playerDeck, enemyDeck) => set({
    battleState: 'playing',
    playerHP: 100,
    enemyHP: 100,
    playerMana: 3,
    enemyMana: 3,
    turn: 'player',
    handCards: playerDeck.slice(0, 3),
  }),

  // 카드 플레이
  playCard: (cardIndex) => set((state) => {
    const card = state.handCards[cardIndex];
    if (state.playerMana < card.cost) return state;

    return {
      playerMana: state.playerMana - card.cost,
      handCards: state.handCards.filter((_, i) => i !== cardIndex),
      fieldCards: {
        ...state.fieldCards,
        player: [...state.fieldCards.player, card]
      }
    };
  }),

  // 턴 종료
  endTurn: () => set((state) => ({
    turn: state.turn === 'player' ? 'enemy' : 'player',
    playerMana: state.turn === 'player' ? 3 : state.playerMana,
    enemyMana: state.turn === 'enemy' ? 3 : state.enemyMana,
  })),

  // HP 업데이트
  updateHP: (target, damage) => set((state) => {
    const newHP = Math.max(0, state[`${target}HP`] - damage);
    return {
      [`${target}HP`]: newHP,
      battleState: newHP <= 0 ? 'finished' : state.battleState
    };
  }),

  // 배틀 종료
  endBattle: () => set({
    battleState: 'idle',
    playerHP: 100,
    enemyHP: 100,
    fieldCards: { player: [], enemy: [] },
    handCards: [],
  }),
}));