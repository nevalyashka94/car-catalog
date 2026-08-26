export interface AIAnalysisResult {
  replyText: string;
  targetCities?: string[];
  targetBrand?: string;
  maxPrice?: number;
  bodyType?: string;
  isAskingCityList?: boolean;
}

const SYSTEM_PROMPT = `
Ты — «Auto.ru Пука кот ассистент AI» для сайта китайских автомобилей.
Твой образ: остроумный кот-автоэксперт («Мяу!», «🐾»). Отвечай по делу.

Верни СТРОГИЙ JSON следующего формата:
{
  "replyText": "Твой живой ответ пользователю от лица кота (на русском языке)",
  "targetCities": ["Краснодар", "Абакан"],
  "targetBrand": "haval",
  "maxPrice": 2000000,
  "bodyType": "suv",
  "isAskingCityList": true
}

Правила:
1. Если спрашивают про Lada/ВАЗ, BMW, Mercedes, Toyota, Kia, Hyundai или Tenet — вежливо поясни в replyText, что в каталоге представлены только современные китайские автомобили.
2. targetBrand пиши на английском в нижнем регистре (haval, geely, zeekr, chery, omoda, jaecoo, exeed, tank, gac, changan, jetour, baic, dongfeng, hongqi, voyah, lixiang, byd, belgee, kaiyi).
3. Возвращай только чистый JSON без разметки.
`;

const BRAND_ALIASES: Record<string, string> = {
  "зикри": "zeekr", "зикр": "zeekr", "зеекр": "zeekr", "zeekr": "zeekr",
  "джили": "geely", "гили": "geely", "geely": "geely",
  "хавал": "haval", "хавейл": "haval", "хавэйл": "haval", "haval": "haval", "хавалы": "haval",
  "чери": "chery", "chery": "chery",
  "омода": "omoda", "omoda": "omoda",
  "джейку": "jaecoo", "jaecoo": "jaecoo",
  "эксид": "exeed", "exeed": "exeed",
  "танк": "tank", "tank": "tank",
  "гак": "gac", "gac": "gac",
  "чанган": "changan", "changan": "changan",
  "джетур": "jetour", "jetour": "jetour",
  "байк": "baic", "baic": "baic",
  "донгфенг": "dongfeng", "dongfeng": "dongfeng",
  "хунци": "hongqi", "hongqi": "hongqi",
  "воя": "voyah", "voyah": "voyah",
  "лисян": "lixiang", "lixiang": "lixiang", "li auto": "lixiang",
  "бид": "byd", "byd": "byd",
  "белджи": "belgee", "бельджи": "belgee", "belgee": "belgee",
};

function fallbackAnalysis(userQuery: string, availableRegions: string[]): AIAnalysisResult {
  const lower = userQuery.toLowerCase();
  
  if (lower.includes("лада") || lower.includes("ваз") || lower.includes("bmw") || lower.includes("бмв") || lower.includes("мерседес")) {
    return {
      replyText: "Мяу! Этот бренд в нашем каталоге отсутствует. 🐾 Мы специализируемся исключительно на современных китайских авто!",
    };
  }

  let targetBrand: string | undefined = undefined;
  for (const [alias, brand] of Object.entries(BRAND_ALIASES)) {
    if (lower.includes(alias)) {
      targetBrand = brand;
      break;
    }
  }

  const targetCities: string[] = [];
  for (const city of availableRegions) {
    if (lower.includes(city.toLowerCase().slice(0, 4))) {
      targetCities.push(city);
    }
  }

  let maxPrice: number | undefined = undefined;
  const mlnMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:млн|миллион|кк)/i);
  if (mlnMatch) maxPrice = parseFloat(mlnMatch[1]) * 1000000;
  if (lower.includes("до миллиона") || lower.includes("до 1 млн")) maxPrice = 1000000;

  const isAskingCityList = lower.includes("город") || lower.includes("где есть") || lower.includes("где купить");

  return {
    replyText: targetBrand 
      ? `Мяу! Нашел автомобили бренда ${targetBrand.toUpperCase()}: 🐾` 
      : `Мяу! Вот что удалось подобрать по твоему запросу: 🐾`,
    targetBrand,
    targetCities: targetCities.length > 0 ? targetCities : undefined,
    maxPrice,
    isAskingCityList,
  };
}

export async function askCatAI(
  userQuery: string,
  availableRegions: string[],
  availableBrands: string[]
): Promise<AIAnalysisResult> {
  const apiKey =
    import.meta.env.VITE_GROQ_API_KEY ||
    import.meta.env.VITE_GEMINI_API_KEY ||
    "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";

  try {
    const userContent = `Список доступных городов: ${availableRegions.join(", ")}
Список марок: ${availableBrands.join(", ")}
Запрос: "${userQuery}"`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
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

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (rawContent) {
        return JSON.parse(rawContent);
      }
    }
  } catch (err) {
    console.warn("Groq API fallback to offline parsing:", err);
  }

  return fallbackAnalysis(userQuery, availableRegions);
}
