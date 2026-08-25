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

Твоя задача: понять запрос пользователя на ЛЮБОМ сленге, с опечатками, вводными словами и выдать СТРОГИЙ JSON следующего формата:
{
  "replyText": "Твой живой ответ пользователю от лица кота (на русском языке)",
  "targetCities": ["Краснодар", "Абакан"], // Список городов из запроса
  "targetBrand": "geely", // Имя бренда в нижнем регистре на английском (zeekr, geely, haval, chery, omoda, jaecoo, exeed, tank, gac, changan, jetour, baic, dongfeng, hongqi, voyah, lixiang, byd, belgee, kaiyi)
  "maxPrice": 2000000, // Бюджет в рублях (число), если упомянут
  "bodyType": "suv" | "sedan", // Кузов, если указан
  "isAskingCityList": true // true, если спрашивают "в каких городах есть...", "где купить..."
}

Правила:
1. Если спрашивают про Lada/ВАЗ, BMW, Mercedes, Toyota, Kia, Hyundai или Tenet — в replyText с кошачьим юмором поясни, что в каталоге представлены исключительно современные китайские авто.
2. Если в запросе несколько городов — добавь их все в массив targetCities.
3. Возвращай исключительно валидный JSON без markdown-оберток (\`\`\`json).
`;

export async function askCatAI(
  userQuery: string,
  availableRegions: string[],
  availableBrands: string[]
): Promise<AIAnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY не задан");
  }

  const promptText = `${SYSTEM_PROMPT}

Список доступных городов в базе:
${availableRegions.join(", ")}

Список доступных марок в базе:
${availableBrands.join(", ")}

Запрос пользователя: "${userQuery}"`;

  const requestBody = {
    contents: [
      {
        role: "user",
        parts: [{ text: promptText }],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
    },
  };

  // 1. Попытка через стандартный endpoint с поддержкой заголовков Bearer и x-goog-api-key
  const endpoints = [
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
  ];

  let lastError: any = null;

  for (const url of endpoints) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          // Очистка от возможных markdown-тегов
          const cleanedJson = rawJson.replace(/```json/g, "").replace(/```/g, "").trim();
          return JSON.parse(cleanedJson);
        }
      } else {
        const errText = await response.text();
        console.warn(`Ошибка API (${response.status}):`, errText);
      }
    } catch (err) {
      lastError = err;
    }
  }

  console.error("Все попытки прямого подключения не удались:", lastError);
  throw new Error("Не удалось получить ответ от Gemini API");
}
