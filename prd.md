# PRD: L'ÉLITE DIET: PRECISION & PROVOCATION (엘리트 다이어트)

## 개요
세계 최고의 정밀 영양 분석과 '잔인할 정도로 솔직한' 팩트 폭격이 결합된 하이엔드 다이어트 케어 서비스입니다. 시각적으로는 파스텔톤의 아름다움을 유지하지만, 분석 결과에서는 사용자의 정신을 번쩍 들게 하는 반전 매력을 선사합니다.

## 핵심 목표
- **압도적인 디자인**: $10,000 이상의 가치를 느낄 수 있는 초고품질 UI/UX (Glassmorphism, High-end Animations).
- **Vision AI**: OpenAI의 `gpt-4o` 모델과 `responses.create` 인터페이스를 통한 고성능 영양 분석.
- **가치 제안**: 단순히 칼로리를 알려주는 것을 넘어, 사용자의 건강을 진심으로 케어하는 듯한 프리미엄 피드백 제공.

## 주요 기능
1. **멀티 사진 업로드 및 식사 분류**
   - 아침, 점심, 저녁, 간식, 야식 중 식사 유형 선택 가능.
   - 한 번의 분석에 최대 3장의 사진을 동시에 업로드하여 정밀 분석 (식탁 위 여러 접시 대응).
   - 인터랙티브한 썸네일 미리보기 프리셋.
2. **Vision 영양 전문 분석 (상세 분할)**
   - **다중 음식 식별**: 사진 내 여러 음식이 있을 경우 각 항목별로 이름을 식별하고 칼로리를 개별 계산.
   - **최종 합계**: 모든 음식의 칼로리를 합산하여 총 칼로리 제공.
   - **데이터 근거**: [식품안전나라 영양성분 데이터](https://various.foodsafetykorea.go.kr/nutrient/)를 기반으로 한 신뢰성 있는 추정.

3. **팩트 폭격 & 가스라이팅 (Fact-Attack)**
   - **반전의 미학**: 예쁜 디자인과 대조되는 날카롭고 직설적인 '팩폭' 피드백.
   - **정신 교육**: "이걸 다 먹고 다이어트 중이라고요? 양심이 어디 갔죠?"와 같은 유머러스하지만 뼈 때리는 조언.
   - **개인화**: 사용자의 프로필과 식사 시간을 고려한 타격감 있는 멘트.

4. **다이어트 기록일지 & 타임라인**
   - **데이터 저장**: 식사 유형별로 분류하여 LocalStorage에 저장.
   - **퍼펙트 캘린더**: 한 달간의 식사 시간대별 달성률을 시각화.

## 디자인 철학 ($10,000 Value)
- **Aesthetics**: Apple이나 최상급 SaaS 제품 수준의 미니멀리즘과 세련된 색감(Emerald Green, Soft White, Deep Shadow).
- **Motion**: `framer-motion`을 활용한 모든 요소의 생동감 넘치는 등장과 퇴장.
- **Glassmorphism**: 배경의 은은한 블러 처리와 유리 질감의 카드 섹션.

## 기술 스택
- **Frontend**: React (Vite), TypeScript, Framer Motion, Lucide-React.
- **AI**: OpenAI `gpt-4o` 모델, `client.responses.create` API 활용.
- **Styling**: Vanilla CSS (Premium Custom Styles).
