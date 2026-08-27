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
Твой образ: остроумный, доброжелательный кот-автоэксперт («Мяу!», «🐾»).

Твоя задача — извлечь параметры из ЛЮБОГО пользовательского запроса и вернуть СТРОГИЙ JSON:
{
  "replyText": "Живой ответ кота на русском языке",
  "targetCities": ["Краснодар"], // Город или массив городов
  "targetBrand": "haval", // Бренд на английском в lowercase
  "minPrice": 800000, // Минимальная цена числом в рублях
  "maxPrice": 1500000, // Максимальная цена числом в рублях
  "bodyType": "suv" | "sedan", // Тип кузова (suv, sedan, hatchback, minivan, pickup)
  "isAskingCityList": false // true, если вопрос "где купить", "в каких городах"
}

СПИСОК БРЕНДОВ В КАТАЛОГЕ:
zeekr, geely, haval, chery, omoda, jaecoo, exeed, tank, gac, changan, jetour, baic, dongfeng, hongqi, voyah, lixiang, byd, belgee, kaiyi, avatr, aito.

ПРАВИЛА И ПРИМЕРЫ РАСПОЗНАВАНИЯ:
1. Цены и числительные:
   - "от 800 тысяч до полутора миллионов" -> minPrice: 800000, maxPrice: 1500000
   - "до 2.5 млн" / "до двух с половиной лямов" -> maxPrice: 2500000
   - "от 3 до 5 кк" / "3-5 млн" -> minPrice: 3000000, maxPrice: 5000000
   - "дороже 4 млн" / "от 4000000" -> minPrice: 4000000
   - "дешевле миллиона" / "до 1 млн" -> maxPrice: 1000000
   - "около 2 млн" / "в районе 2 млн" -> minPrice: 1700000, maxPrice: 2300000

2. Города и падежи:
   - "а какие в краснодаре?" / "че есть в питере" / "в абакане" -> targetCities: ["Краснодар"]
   - "в москве и сочи" -> targetCities: ["Москва", "Сочи"]

3. Комплексные запросы:
   - "кроссоверы хавал в краснодаре до 3 млн" -> targetBrand: "haval", targetCities: ["Краснодар"], bodyType: "suv", maxPrice: 3000000
   - "седан джили от полутора до двух миллионов" -> targetBrand: "geely", bodyType: "sedan", minPrice: 1500000, maxPrice: 2000000

4. Некитайские марки (Lada/ВАЗ, BMW, Mercedes, Toyota, Kia, Hyundai, Audi, VW, Tesla, Tenet):
   - Поясни в replyText с кошачьим юмором, что в каталоге только современные китайские автомобили.

5. Возвращай исключительно валидный JSON без markdown-разметки (\`\`\`json).
`;

const BRAND_ALIASES: Record<string, string> = {
  "зикри": "zeekr", "зикр": "zeekr", "зеекр": "zeekr", "zeekr": "zeekr",
  "джили": "geely", "гили": "geely", "geely": "geely",
  "хавал": "haval", "хавейл": "haval", "хавэйл": "haval", "haval": "haval", "хавалы": "haval", "хавэйлы": "haval",
  "чери": "chery", "черей": "chery", "chery": "chery",
  "омода": "omoda", "омоду": "omoda", "omoda": "omoda",
  "джейку": "jaecoo", "джаеку": "jaecoo", "jaecoo": "jaecoo",
  "эксид": "exeed", "эксит": "exeed", "exeed": "exeed",
  "танк": "tank", "тэнк": "tank", "tank": "tank", "танки": "tank",
  "гак": "gac", "gac": "gac",
  "чанган": "changan", "чанъань": "changan", "changan": "changan",
  "джетур": "jetour", "джетуры": "jetour", "jetour": "jetour",
  "байк": "baic", "баик": "baic", "baic": "baic",
  "донгфенг": "dongfeng", "донфенг": "dongfeng", "dongfeng": "dongfeng",
  "хунци": "hongqi", "хончи": "hongqi", "hongqi": "hongqi",
  "воя": "voyah", "воях": "voyah", "voyah": "voyah",
  "лисян": "lixiang", "ли9": "lixiang", "ли7": "lixiang", "lixiang": "lixiang", "li auto": "lixiang",
  "бид": "byd", "byd": "byd",
  "белджи": "belgee", "бельджи": "belgee", "belgee": "belgee",
  "кай": "kaiyi", "кайи": "kaiyi", "kaiyi": "kaiyi",
  "аватр": "avatr", "аватар": "avatr", "avatr": "avatr",
  "айто": "aito", "аито": "aito", "aito": "aito",
};

const NON_CATALOG_BRANDS = [
  "лада", "ваз", "жигули", "lada", "bmw", "бмв", "мерседес", "mercedes",
  "audi", "ауди", "тойота", "toyota", "киа", "kia", "hyundai", "хендай", "хёндай", "тесла", "tesla", "тенет", "tenet"
];

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

// Конвертер текстовых числительных и сумм в число
function parseWordNumber(phrase: string): number | null {
  const p = phrase.toLowerCase().trim();
  if (!p) return null;

  if (p.includes("полутора") || p.includes("полтора")) return 1.5;
  if (p.includes("два с половиной") || p.includes("двух с половиной") || p.includes("2.5") || p.includes("2,5")) return 2.5;
  if (p.includes("три с половиной") || p.includes("трех с половиной") || p.includes("3.5") || p.includes("3,5")) return 3.5;

  const wordMap: Record<string, number> = {
    "сто": 100, "двести": 200, "триста": 300, "четыреста": 400, "пятьсот": 500,
    "шестьсот": 600, "семьсот": 700, "восемьсот": 800, "девятьсот": 900,
    "один": 1, "одного": 1, "два": 2, "двух": 2, "три": 3, "трех": 3,
    "четыре": 4, "четырех": 4, "пять": 5, "пяти": 5, "шесть": 6, "шести": 6,
    "семь": 7, "семи": 7, "восемь": 8, "восьми": 8, "девять": 9, "девяти": 9, "десять": 10,
  };

  const digits = p.match(/(\d+(?:[.,]\d+)?)/);
  if (digits) {
    return parseFloat(digits[1].replace(",", "."));
  }

  for (const [w, val] of Object.entries(wordMap)) {
    if (p.includes(w)) return val;
  }
  return null;
}

function parseAdvancedPrice(text: string): { minPrice?: number; maxPrice?: number } {
  const clean = text.toLowerCase().replace(/,/g, ".");
  let minPrice: number | undefined = undefined;
  let maxPrice: number | undefined = undefined;

  // 1. Диапазон "от X до Y"
  const rangeMatch = clean.match(/от\s+([а-яa-z0-9\s.,]+?)\s+до\s+([а-яa-z0-9\s.,]+)/i);
  if (rangeMatch) {
    const partFrom = rangeMatch[1];
    const partTo = rangeMatch[2];

    const numFrom = parseWordNumber(partFrom);
    const numTo = parseWordNumber(partTo);

    if (numFrom !== null) {
      if (partFrom.includes("тысяч") || partFrom.includes("тыс") || partFrom.includes("к") || numFrom >= 100) {
        minPrice = numFrom < 1000 ? numFrom * 1000 : numFrom;
      } else {
        minPrice = numFrom * 1000000;
      }
    }

    if (numTo !== null) {
      if (partTo.includes("тысяч") || partTo.includes("тыс") || (!partTo.includes("млн") && !partTo.includes("миллион") && !partTo.includes("лям") && numTo >= 100)) {
        maxPrice = numTo < 1000 ? numTo * 1000 : numTo;
      } else {
        maxPrice = numTo * 1000000;
      }
    }

    return { minPrice, maxPrice };
  }

  // 2. Диапазон "X - Y млн / кк"
  const dashMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:-|до)\s*(\d+(?:\.\d+)?)\s*(?:млн|миллион|кк|лям|m)/i);
  if (dashMatch) {
    minPrice = parseFloat(dashMatch[1]) * 1000000;
    maxPrice = parseFloat(dashMatch[2]) * 1000000;
    return { minPrice, maxPrice };
  }

  // 3. Только "до X"
  const maxMatch = clean.match(/(?:до|дешевле|бюджет)\s+([а-яa-z0-9\s.,]+)/i);
  if (maxMatch) {
    const num = parseWordNumber(maxMatch[1]);
    if (num !== null) {
      if (maxMatch[1].includes("тысяч") || maxMatch[1].includes("тыс") || num >= 100) {
        maxPrice = num < 1000 ? num * 1000 : num;
      } else {
        maxPrice = num * 1000000;
      }
    }
  }

  // 4. Только "от X"
  const minMatch = clean.match(/(?:от|дороже|свыше)\s+([а-яa-z0-9\s.,]+)/i);
  if (minMatch) {
    const num = parseWordNumber(minMatch[1]);
    if (num !== null) {
      if (minMatch[1].includes("тысяч") || minMatch[1].includes("тыс") || num >= 100) {
        minPrice = num < 1000 ? num * 1000 : num;
      } else {
        minPrice = num * 1000000;
      }
    }
  }

  return { minPrice, maxPrice };
}

function fallbackAnalysis(userQuery: string, availableRegions: string[]): AIAnalysisResult {
  const lower = userQuery.toLowerCase();

  for (const nonCat of NON_CATALOG_BRANDS) {
    if (lower.includes(nonCat)) {
      return {
        replyText: `Мяу! Бренд «${nonCat.toUpperCase()}» в нашем каталоге отсутствует. 🐾\nМы специализируемся исключительно на современных китайских автомобилях.`,
      };
    }
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
  const { minPrice, maxPrice } = parseAdvancedPrice(lower);

  let bodyType: string | undefined = undefined;
  if (lower.includes("кроссовер") || lower.includes("suv") || lower.includes("внедорожник") || lower.includes("джип")) bodyType = "suv";
  if (lower.includes("седан")) bodyType = "sedan";
  if (lower.includes("минивэн") || lower.includes("вэн")) bodyType = "minivan";

  const isAskingCityList = lower.includes("город") || lower.includes("где есть") || lower.includes("где купить") || lower.includes("в каких");

  const parts: string[] = [];
  if (targetBrand) parts.push(`бренда ${targetBrand.toUpperCase()}`);
  if (detectedCity) parts.push(`в г. ${detectedCity}`);
  if (bodyType) parts.push(`кузов: ${bodyType}`);

  if (minPrice && maxPrice) {
    const fromStr = minPrice >= 1000000 ? `${(minPrice / 1000000).toFixed(1)} млн` : `${(minPrice / 1000).toFixed(0)} тыс`;
    const toStr = maxPrice >= 1000000 ? `${(maxPrice / 1000000).toFixed(1)} млн` : `${(maxPrice / 1000).toFixed(0)} тыс`;
    parts.push(`от ${fromStr} до ${toStr} ₽`);
  } else if (minPrice) {
    const fromStr = minPrice >= 1000000 ? `${(minPrice / 1000000).toFixed(1)} млн` : `${(minPrice / 1000).toFixed(0)} тыс`;
    parts.push(`от ${fromStr} ₽`);
  } else if (maxPrice) {
    const toStr = maxPrice >= 1000000 ? `${(maxPrice / 1000000).toFixed(1)} млн` : `${(maxPrice / 1000).toFixed(0)} тыс`;
    parts.push(`до ${toStr} ₽`);
  }

  const replyText = parts.length > 0
    ? `Мяу! Нашел варианты (${parts.join(", ")}): 🐾`
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
    const userContent = `Список городов: ${availableRegions.join(", ")}
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
        // Дополнительная валидация города
        if (!parsed.targetCities || parsed.targetCities.length === 0) {
          const matched = extractCityMatch(userQuery, availableRegions);
          if (matched) parsed.targetCities = [matched];
        }
        return parsed;
      }
    }
  } catch (err) {
    console.warn("AI LLM Fallback:", err);
  }

  return fallbackAnalysis(userQuery, availableRegions);
}
