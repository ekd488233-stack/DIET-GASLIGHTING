import OpenAI from "openai";

const client = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY || "dummy",
    dangerouslyAllowBrowser: true,
});

export interface MealAnalysis {
    items: { name: string; kcal: number }[];
    total_kcal: number;
    exercise_plan: {
        name: string;
        duration: string;
        sets: string;
        video_search_term: string;
    }[];
    personalized_advice: string;
    fact_attack: string;
}

export async function analyzeMealImages(
    base64Images: string[],
    profile: { age: string; gender: string },
    mealType: string
): Promise<MealAnalysis> {
    const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
        { type: "text", text: `${mealType} 식단을 분석해줘.` }
    ];

    base64Images.forEach((img) => {
        content.push({
            type: "image_url",
            image_url: { url: `data:image/jpeg;base64,${img}` }
        });
    });

    const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: "system",
                content: `너는 "DIET GASLIGHTING"의 수석 영양 분석가이자, 아주 독설적이고 냉철한 팩폭 전문가야. 
        사용자가 올린 최대 3장의 사진에서 모든 음식을 분석하고 영양 정보를 제공해.
        
        요구사항:
        1. 이미지들 속의 모든 음식을 개별 식별하고 각각의 예상 칼로리를 계산해.
        2. 모든 항목의 칼로리를 합산해.
        3. 사용자의 연령대(${profile.age}), 성별(${profile.gender}), 그리고 식사 유형(${mealType})을 고려해.
        4. **팩트 폭격(fact_attack)**: 이 서비스는 가스라이팅하듯 아주 직설적이고 차가운 팩폭을 날려 유머러스하지만 정신을 번쩍 들게 하는 게 핵심이야. 예쁜 디자인에 속아 정신 못 차리는 사용자에게 다이어트의 쓴맛을 보여줘.
        5. **다양한 운동 추천**: 단순히 러닝이나 스쿼트만 추천하지 말고, 버핏 테스트, 자전거 타기, 등산, 수영, 플랭크, 고강도 인터벌 트레이닝(HIIT) 등 섭취한 칼로리를 태울 수 있는 아주 다양한 운동을 상황에 맞춰 추천해줘.
        6. 결과는 항상 JSON 형식으로만 반환해.
        
        응답 형식 JSON:
        {
          "items": [{"name": "음식명", "kcal": 0}],
          "total_kcal": 0,
          "exercise_plan": [{"name": "운동명", "duration": "30분", "sets": "3세트", "video_search_term": "운동명"}],
          "personalized_advice": "전문적인 조언",
          "fact_attack": "이곳에 사용자의 정신을 번쩍 들게 할 강력한 독설과 팩폭을 적어줘."
        }`
            },
            {
                role: "user",
                content: content
            }
        ],
        response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content || "{}") as MealAnalysis;
}
