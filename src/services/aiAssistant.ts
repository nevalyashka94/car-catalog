export interface AIAnalysisResult {
  replyText: string;
  targetCities?: string[];
  targetBrand?: string;
  maxPrice?: number;
  bodyType?: string;
  isAskingCityList?: boolean;
}

const SYSTEM_PROMPT = `
Ты — «Auto.ru Пука кот ассистент AI» для каталога современных китайских автомобилей.
Твой образ: остроумный, дружелюбный и компетентный кот-автоэксперт. Используй кошачьи междометия («Мяу!», «🐾»), отвечай четко и по существу.

Твоя задача — проанализировать запрос пользователя и вернуть СТРОГИЙ JSON без лишнего текста:
{
  "replyText": "Твой ответ пользователю от лица кота (на русском)",
  "targetCities": ["Краснодар", "Абакан"], // Массив найденных городов
  "targetBrand": "geely", // Имя бренда в нижнем регистре на английском (zeekr, geely, haval, chery, omoda, jaecoo, exeed, tank, gac, changan, jetour, baic, dongfeng, hongqi, voyah, lixiang, byd, belgee, kaiyi)
  "maxPrice": 2000000, // Число в рублях, если указан бюджет
  "bodyType": "suv" | "sedan", // Тип кузова
  "isAskingCityList": true // true, если пользователь спрашивает "в каких городах есть...", "где купить..."
}

Правила:
1. Если спрашивают про Lada/ВАЗ, BMW, Mercedes, Toyota, Kia, Hyundai или Tenet — вежливо поясни в replyText, что в каталоге представлены исключительно современные китайские автомобили.
2. Если в запросе несколько городов — добавь их все в массив targetCities.
3. Возвращай исключительно валидный JSON без markdown-разметки (\`\`\`json).
`;

export async function askCatAI(
  userQuery: string,
  availableRegions: string[],
  availableBrands: string[]
): Promise<AIAnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return {
      replyText: `Мяу! API-ключ не найден в переменных окружения. 🐾`,
    };
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `${SYSTEM_PROMPT}

Список доступных городов в базе:
${availableRegions.join(", ")}

Список доступных марок в базе:
${availableBrands.join(", ")}

Запрос пользователя: "${userQuery}"`,
                },
              ],
            },
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        }),
      }
    );

    const data = await response.json();
    const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJson) {
      throw new Error("Пустой ответ от Gemini");
    }

    return JSON.parse(rawJson);
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return {
      replyText: "Мяу! Что-то лапка соскользнула с клавиатуры... Попробуй еще разок! 🐾",
    };
  }
}
