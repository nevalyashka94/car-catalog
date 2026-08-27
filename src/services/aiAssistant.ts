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
Твой образ: остроумный кот-автоэксперт («Мяу!», «🐾»).

Твоя задача — извлечь параметры из ЛЮБОГО запроса (включая краткие вопросы вроде "а какие в краснодаре", "а в абакане?", "че есть в москве") и вернуть СТРОГИЙ JSON:
{
  "replyText": "Живой ответ кота на русском (например: Мяу! Вот доступные авто у дилеров в Краснодаре: 🐾)",
  "targetCities": ["Краснодар"], // ВСЕГДА извлекай город, если он упомянут (даже в падежах "в краснодаре", "по москве", "в питере" -> "Санкт-Петербург")
  "targetBrand": "haval", // Бренд на английском, если упомянут
  "maxPrice": 2000000, // Число рублей при наличии бюджета
  "bodyType": "suv" | "sedan",
  "isAskingCityList": false
}

Правила:
1. Если вопрос касается любого города (например "а какие в краснодаре", "что есть в абакане") — ОБЯЗАТЕЛЬНО заполни "targetCities": ["ИмяГорода"].
2. Если спрашивают про некитайские марки (Lada, BMW, Mercedes, Toyota, Kia, Hyundai) — вежливо поясни в replyText, что у нас представлены только современные китайские автомобили.
3. Отвечай только валидным JSON без markdown-оберток.
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

export function extractCityMatch(text: string, availableRegions: string[]): string | undefined {
  const clean = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, " ");
  const words = clean.split(/\s+/).filter(Boolean);

  for (const city of availableRegions) {
    const cityLower = city.toLowerCase();
    if (clean.includes(cityLower)) return city;

    const baseStem = cityLower.length > 4 ? cityLower.slice(0, -1) : cityLower;
    const shortStem = cityLower.length > 5 ? cityLower.slice(0, -2) : baseStem;

    if (words.some((w) => w.length >= 3 && (w.startsWith(baseStem) || w.startsWith(shortStem)))) {
      return city;
    }
  }
  return undefined;
}

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

  const detectedCity = extractCityMatch(lower, availableRegions);
  const targetCities = detectedCity ? [detectedCity] : undefined;

  let maxPrice: number | undefined = undefined;
  const mlnMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:млн|миллион|кк)/i);
  if (mlnMatch) maxPrice = parseFloat(mlnMatch[1]) * 1000000;
  if (lower.includes("до миллиона") || lower.includes("до 1 млн")) maxPrice = 1000000;

  const isAskingCityList = lower.includes("город") || lower.includes("где есть") || lower.includes("где купить");

  let replyText = "Мяу! Вот что удалось подобрать по твоему запросу: 🐾";
  if (detectedCity && targetBrand) {
    replyText = `Мяу! Вот автомобили ${targetBrand.toUpperCase()} у дилеров в г. ${detectedCity}: 🐾`;
  } else if (detectedCity) {
    replyText = `Мяу! Вот доступные автомобили у официальных дилеров в г. ${detectedCity}: 🐾`;
  } else if (targetBrand) {
    replyText = `Мяу! Найдено по бренду ${targetBrand.toUpperCase()}: 🐾`;
  }

  return {
    replyText,
    targetBrand,
    targetCities,
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
        temperature: 0.1,
      }),
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const rawContent = data.choices?.[0]?.message?.content;
      if (rawContent) {
        const parsed: AIAnalysisResult = JSON.parse(rawContent);
        // Дополнительная валидация города, если нейросеть пропустила
        if (!parsed.targetCities || parsed.targetCities.length === 0) {
          const matched = extractCityMatch(userQuery, availableRegions);
          if (matched) parsed.targetCities = [matched];
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn("AI Fallback:", err);
  }

  return fallbackAnalysis(userQuery, availableRegions);
}
