export interface AIAnalysisResult {
  replyText: string;
  targetCities?: string[];
  targetBrand?: string;
  minPrice?: number;
  maxPrice?: number;
  bodyType?: string;
  isAskingCityList?: boolean;
}

const SYSTEM_PROMPT = `
Ты — «Auto.ru Пука кот ассистент AI» для каталога современных китайских автомобилей.
Твой образ: остроумный кот-автоэксперт («Мяу!», «🐾»).

Твоя задача — извлечь точные параметры фильтрации из ЛЮБОГО запроса и вернуть СТРОГИЙ JSON:
{
  "replyText": "Живой ответ кота на русском (например: Мяу! Вот отличные авто от 3 до 8 млн ₽: 🐾)",
  "targetCities": ["Краснодар"],
  "targetBrand": "geely",
  "minPrice": 3000000, // Минимальная цена в рублях (если есть "от 3 млн", "от 3-8 млн")
  "maxPrice": 8000000, // Максимальная цена в рублях (если есть "до 8 млн", "от 3-8 млн")
  "bodyType": "suv" | "sedan",
  "isAskingCityList": false
}

Правила:
1. Если пользователь пишет диапазон цен (например "от 3 до 8 млн", "3-8 млн", "от 4 млн") — обязательно заполни minPrice и/или maxPrice числами в рублях.
2. targetBrand пиши на английском в нижнем регистре (geely, haval, zeekr, chery, omoda, jaecoo, exeed, tank, gac, changan, jetour, baic, dongfeng, hongqi, voyah, lixiang, byd, belgee, kaiyi).
3. Возвращай исключительно валидный JSON-объект без markdown-разметки.
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

function parsePriceRange(text: string): { minPrice?: number; maxPrice?: number } {
  const clean = text.toLowerCase().replace(/,/g, ".");
  let minPrice: number | undefined = undefined;
  let maxPrice: number | undefined = undefined;

  // Шаблон "от X до Y млн" или "X-Y млн"
  const rangeMatch = clean.match(/(?:от\s*)?(\d+(?:\.\d+)?)\s*(?:-|до)\s*(\d+(?:\.\d+)?)\s*(?:млн|миллион|кк|m|mln)/i);
  if (rangeMatch) {
    minPrice = parseFloat(rangeMatch[1]) * 1000000;
    maxPrice = parseFloat(rangeMatch[2]) * 1000000;
    return { minPrice, maxPrice };
  }

  // Шаблон "от X млн" / "дороже X млн"
  const minMatch = clean.match(/(?:от|дороже|свыше)\s*(\d+(?:\.\d+)?)\s*(?:млн|миллион|кк)/i);
  if (minMatch) {
    minPrice = parseFloat(minMatch[1]) * 1000000;
  }

  // Шаблон "до Y млн" / "дешевле Y млн"
  const maxMatch = clean.match(/(?:до|дешевле|бюджет)\s*(\d+(?:\.\d+)?)\s*(?:млн|миллион|кк)/i);
  if (maxMatch) {
    maxPrice = parseFloat(maxMatch[1]) * 1000000;
  }

  if (clean.includes("до миллиона") || clean.includes("до 1 млн")) maxPrice = 1000000;
  if (clean.includes("от миллиона") || clean.includes("от 1 млн")) minPrice = 1000000;

  return { minPrice, maxPrice };
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
  const { minPrice, maxPrice } = parsePriceRange(lower);

  let bodyType: string | undefined = undefined;
  if (lower.includes("кроссовер") || lower.includes("suv") || lower.includes("внедорожник")) bodyType = "кроссовер";
  if (lower.includes("седан")) bodyType = "седан";

  const isAskingCityList = lower.includes("город") || lower.includes("где есть") || lower.includes("где купить");

  const parts: string[] = [];
  if (targetBrand) parts.push(`бренда ${targetBrand.toUpperCase()}`);
  if (detectedCity) parts.push(`в г. ${detectedCity}`);
  if (minPrice && maxPrice) parts.push(`от ${(minPrice / 1000000).toFixed(1)} до ${(maxPrice / 1000000).toFixed(1)} млн ₽`);
  else if (minPrice) parts.push(`от ${(minPrice / 1000000).toFixed(1)} млн ₽`);
  else if (maxPrice) parts.push(`до ${(maxPrice / 1000000).toFixed(1)} млн ₽`);

  const replyText = parts.length > 0
    ? `Мяу! Нашел варианты по параметрам (${parts.join(", ")}): 🐾`
    : `Мяу! Вот что удалось подобрать по твоему запросу: 🐾`;

  return {
    replyText,
    targetBrand,
    targetCities,
    minPrice,
    maxPrice,
    bodyType,
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
