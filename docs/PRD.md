# 🦕 쥬라기 포켓몬 시뮬레이터 v2.0 상세 기획서(PRD)

**작성일:** 2026.03.13  
**작성자:** 멍뭉 (겨울햇살팀 전략기획)  
**협업자:** 치치(마케팅)  

---

## 📋 1. 프로젝트 개요 & 목적

### 1.1 프로젝트 비전
- **게임명**: 쥬라기 포켓몬 시뮬레이터 (Jurassic Pocket Simulator)
- **장르**: 카드 배틀 RPG + 수집형 게임
- **목표**: 공룡 애호가와 카드게임 유저를 타겟으로 한 차별화된 수집형 배틀게임

### 1.2 핵심 게임루프
```
카드 뽑기 → 덱 구성 → PvP/PvE 배틀 → 보상 획득 → 카드 강화 → 반복
```

---

## 🎯 2. 핵심 기능 목록 (우선순위별)

### Phase 1 (MVP) - 4주
1. **회원가입/로그인 시스템**
2. **기본 카드 뽑기 시스템**
3. **카드 인벤토리 관리**
4. **간단한 PvE 배틀**

### Phase 2 - 6주
5. **덱 빌딩 시스템**
6. **카드 강화/진화 시스템**
7. **PvP 배틀 (실시간/비실시간)**
8. **랭킹 시스템**

### Phase 3 - 4주
9. **시즌제/이벤트**
10. **길드 시스템**
11. **수익화 요소 (상점)**

---

## 📱 3. 화면별 기능 명세

### 3.1 메인 화면
```
[상단]
- 유저 정보: 닉네임, 레벨, 경험치바
- 재화: 코인, 다이아, 카드팩 티켓

[중앙]
- 일일 미션 알림
- 이벤트 배너 (터치시 해당 메뉴로 이동)
- 신규 공룡 소개

[하단 네비게이션]
- 홈 / 뽑기 / 덱 / 배틀 / 랭킹
```

### 3.2 뽑기 화면
```
[카드팩 선택]
- 일반팩 (100코인) - 커먼 70%, 언커먼 25%, 레어 5%
- 프리미엄팩 (300코인 or 100다이아) - 커먼 40%, 언커먼 35%, 레어 20%, 에픽 5%
- 전설팩 (1000다이아) - 레어 60%, 에픽 30%, 레전드 10%

[뽑기 애니메이션]
- 공룡알 → 크랙 → 등급별 이펙트 → 카드 등장

[결과 화면]
- 획득한 카드 목록
- 새로 획득한 카드 [NEW] 표시
- 중복 카드시 강화 재료로 자동 변환
```

### 3.3 덱 빌딩 화면
```
[덱 슬롯] (최대 5장)
- 드래그 앤 드롭으로 카드 배치
- 총 코스트 표시 (초과시 경고)
- 덱 밸런스 분석 (공격/방어/특수)

[카드 필터]
- 등급별, 타입별, 코스트별 필터링
- 검색 기능 (공룡명)

[프리셋 덱]
- 추천 덱 구성 3개 제공
- 커스텀 덱 저장 (최대 5개)
```

### 3.4 배틀 화면
```
[배틀 UI]
- 상대방 정보 (닉네임, 랭크)
- HP바, 마나 게이지
- 손패 (최대 5장)
- 필드 (각자 3슬롯)

[배틀 플로우]
1. 선후공 결정 (랜덤)
2. 카드 드로우 (3장)
3. 턴제 진행
4. 승리조건: 상대 HP 0 or 덱 아웃

[배틀 결과]
- 승/패 표시
- 경험치, 코인 보상
- 랭킹 포인트 변동
```

### 3.5 랭킹 화면
```
[시즌 정보]
- 현재 시즌, 남은 기간
- 내 랭크, 포인트
- 다음 등급까지 필요 포인트

[리더보드]
- 전체 랭킹 (TOP 100)
- 친구 랭킹
- 지역별 랭킹

[시즌 보상]
- 등급별 보상 미리보기
- 시즌 종료시 지급되는 보상
```

---

## 💾 4. 데이터 구조 제안

### 4.1 사용자 관련 테이블
```sql
-- users 테이블
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    level INT DEFAULT 1,
    exp INT DEFAULT 0,
    coins BIGINT DEFAULT 1000,
    diamonds INT DEFAULT 100,
    rank_points INT DEFAULT 1000,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- user_cards 테이블 (유저 보유 카드)
CREATE TABLE user_cards (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    card_id INT,
    level INT DEFAULT 1,
    enhancement_level INT DEFAULT 0,
    obtained_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (card_id) REFERENCES cards(id)
);
```

### 4.2 카드 관련 테이블
```sql
-- cards 테이블 (마스터 데이터)
CREATE TABLE cards (
    id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rarity ENUM('COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'),
    type ENUM('ATTACK', 'DEFENSE', 'SUPPORT'),
    cost INT NOT NULL,
    base_attack INT,
    base_hp INT,
    special_ability TEXT,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP
);

-- decks 테이블
CREATE TABLE decks (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT,
    name VARCHAR(100) DEFAULT 'My Deck',
    card_ids JSON, -- [1,2,3,4,5] 형태로 저장
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### 4.3 배틀 관련 테이블
```sql
-- battles 테이블
CREATE TABLE battles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    player1_id BIGINT,
    player2_id BIGINT,
    winner_id BIGINT,
    battle_type ENUM('PVP', 'PVE'),
    battle_log JSON, -- 상세 배틀 로그
    duration_seconds INT,
    created_at TIMESTAMP,
    FOREIGN KEY (player1_id) REFERENCES users(id),
    FOREIGN KEY (player2_id) REFERENCES users(id)
);
```

---

## 🔌 5. API 엔드포인트 설계

### 5.1 인증 API
```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
DELETE /api/auth/logout
```

### 5.2 사용자 API
```
GET /api/users/profile
PUT /api/users/profile
GET /api/users/inventory
GET /api/users/stats
```

### 5.3 카드/덱 API
```
GET /api/cards                    # 전체 카드 목록
GET /api/cards/{id}               # 카드 상세 정보
POST /api/gacha/draw              # 뽑기 실행
GET /api/decks                    # 유저 덱 목록
POST /api/decks                   # 덱 생성
PUT /api/decks/{id}               # 덱 수정
DELETE /api/decks/{id}            # 덱 삭제
POST /api/cards/{id}/enhance      # 카드 강화
```

### 5.4 배틀 API
```
POST /api/battles/match           # 매칭 요청
GET /api/battles/queue            # 매칭 큐 상태
POST /api/battles/{id}/action     # 배틀 액션
GET /api/battles/{id}             # 배틀 상태 조회
GET /api/battles/history          # 배틀 히스토리
```

### 5.5 랭킹 API
```
GET /api/rankings                 # 전체 랭킹
GET /api/rankings/friends         # 친구 랭킹
GET /api/seasons/current          # 현재 시즌 정보
```

---

## ⚡ 6. 기술스택 추천

### 6.1 백엔드 (유키 담당)
```
Framework: Spring Boot 3.2
Database: MySQL 8.0 + Redis
Authentication: JWT
Real-time: WebSocket (STOMP)
Deployment: Docker + AWS ECS
Monitoring: CloudWatch + Sentry
```

### 6.2 프론트엔드 (푸딩 담당)
```
Framework: React 18 + TypeScript
State: Redux Toolkit
UI Library: Material-UI v5
Animation: Framer Motion
Build: Vite
Mobile: React Native (차후)
```

### 6.3 공통 인프라
```
Cloud: AWS
CDN: CloudFront
File Storage: S3
CI/CD: GitHub Actions
Monitoring: DataDog
```

---

## 📊 7. 카드 밸런싱 시트 설계

### 7.1 등급별 능력치 구간
| 등급 | 코스트 | 공격력 | 체력 | 특수능력 | 드랍률 |
|------|--------|--------|------|----------|---------|
| COMMON | 1-3 | 100-300 | 150-400 | 없음 | 60% |
| UNCOMMON | 2-4 | 250-450 | 300-600 | 단순 | 25% |
| RARE | 3-5 | 400-700 | 500-900 | 중급 | 10% |
| EPIC | 4-6 | 600-1000 | 700-1200 | 고급 | 4% |
| LEGENDARY | 5-7 | 900-1500 | 1000-1800 | 유니크 | 1% |

### 7.2 강화 확률표
| 강화 단계 | 성공률 | 필요 재료 | 공격력 증가 | 체력 증가 |
|-----------|--------|-----------|-------------|-----------|
| +1 | 90% | 같은 카드 2장 | +10% | +10% |
| +2 | 80% | 같은 카드 3장 | +15% | +15% |
| +3 | 70% | 같은 카드 4장 | +20% | +20% |
| +4 | 60% | 같은 카드 5장 | +25% | +25% |
| +5 | 50% | 같은 카드 6장 | +30% | +30% |

---

## 🎨 8. 와이어프레임 (텍스트 기반)

### 메인 화면
```
┌─────────────────────────┐
│ [⚙️]    멍뭉님   [💰1,250]│
│                  [💎100] │
├─────────────────────────┤
│   📋 일일미션 (2/3)      │
├─────────────────────────┤
│  🎉 신규 공룡 이벤트    │
│     [티라노사우르스]     │
├─────────────────────────┤
│  🔥 이번주 인기 덱      │
│     [공격형 덱]         │
└─────────────────────────┘
│🏠│📦│🃏│⚔️│🏆│
```

### 뽑기 화면
```
┌─────────────────────────┐
│      🥚 카드 뽑기       │
├─────────────────────────┤
│  [📦 일반팩]            │
│   100코인 │ 1회뽑기     │
│   900코인 │ 10회뽑기    │
├─────────────────────────┤
│  [⭐ 프리미엄팩]        │
│   300코인 │ 1회뽑기     │
│   100다이아│ 1회뽑기     │
├─────────────────────────┤
│  [👑 전설팩]            │
│   1000다이아│ 1회뽑기    │
└─────────────────────────┘
```

---

## 🦕 9. 공룡 47종 데이터시트 (샘플 5종)

### 9.1 티라노사우르스
```yaml
id: 001
name: "티라노사우르스"
name_en: "Tyrannosaurus Rex"
rarity: LEGENDARY
type: ATTACK
cost: 7
base_attack: 1200
base_hp: 1500
special_ability: "포효