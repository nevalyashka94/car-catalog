export interface AIAnalysisResult {
  replyText: string;
  targetCities?: string[];
  targetBrand?: string;
  maxPrice?: number;
  bodyType?: string;
  isAskingCityList?: boolean;
}

const SYSTEM_PROMPT = `
Ты — «Auto.ru Пука кот ассистент AI» для сайта-каталога современных китайских автомобилей.
Твой образ: остроумный, дружелюбный и компетентный кот-автоэксперт. Используй кошачьи междометия («Мяу!», «🐾»), отвечай четко и по делу.

Твоя задача — проанализировать запрос пользователя на ЛЮБОМ сленге, с опечатками, вводными словами и выдать СТРОГИЙ JSON следующего формата:
{
  "replyText": "Твой живой ответ пользователю от лица кота (на русском языке)",
  "targetCities": ["Краснодар", "Абакан"],
  "targetBrand": "geely",
  "maxPrice": 2000000,
  "bodyType": "suv" | "sedan",
  "isAskingCityList": true
}

Правила:
1. Если спрашивают про Lada/ВАЗ, BMW, Mercedes, Toyota, Kia, Hyundai или Tenet — в replyText вежливо и с юмором поясни, что в каталоге представлены исключительно современные китайские авто.
2. Если в запросе несколько городов — добавь их все в массив targetCities.
3. Возвращай исключительно валидный JSON-объект без markdown-оберток.
`;

export async function askCatAI(
  userQuery: string,
  availableRegions: string[],
  availableBrands: string[]
): Promise<AIAnalysisResult> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("API ключ не найден");
  }

  const userContent = `Список доступных городов в базе:
${availableRegions.join(", ")}

Список доступных марок в базе:
${availableBrands.join(", ")}

Запрос пользователя: "${userQuery}"`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      response_format: { type: "json_object" },
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Groq API Error:", response.status, errorBody);
    throw new Error(`API error: ${response.status}`);
  }

  const data = await response.json();
  const rawContent = data.choices?.[0]?.message?.content;

  if (!rawContent) {
    throw new Error("Пустой ответ от AI");
  }

  return JSON.parse(rawContent);
}
