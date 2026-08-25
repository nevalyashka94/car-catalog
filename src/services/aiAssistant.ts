export interface AIAnalysisResult {
  replyText: string;
  targetCities?: string[];
  targetBrand?: string;
  maxPrice?: number;
  bodyType?: string;
  isAskingCityList?: boolean;
}

const BRAND_ALIASES: Record<string, string> = {
  "зикри": "zeekr", "зикро": "zeekr", "зикр": "zeekr", "зеекр": "zeekr", "zeekr": "zeekr",
  "джили": "geely", "гили": "geely", "geely": "geely",
  "хавал": "haval", "хавейл": "haval", "хавэйл": "haval", "haval": "haval",
  "чери": "chery", "черей": "chery", "chery": "chery",
  "омода": "omoda", "omoda": "omoda",
  "джейку": "jaecoo", "джаеку": "jaecoo", "jaecoo": "jaecoo",
  "эксид": "exeed", "эксит": "exeed", "exeed": "exeed",
  "танк": "tank", "тэнк": "tank", "tank": "tank",
  "гак": "gac", "gac": "gac",
  "чанган": "changan", "чанъань": "changan", "changan": "changan",
  "джетур": "jetour", "jetour": "jetour",
  "байк": "baic", "баик": "baic", "baic": "baic",
  "донгфенг": "dongfeng", "донфенг": "dongfeng", "dongfeng": "dongfeng",
  "хунци": "hongqi", "хончи": "hongqi", "hongqi": "hongqi",
  "воя": "voyah", "воях": "voyah", "voyah": "voyah",
  "лисян": "lixiang", "ли9": "lixiang", "ли7": "lixiang", "lixiang": "lixiang", "li auto": "lixiang",
  "бид": "byd", "буд": "byd", "byd": "byd",
  "белджи": "belgee", "бельджи": "belgee", "belgee": "belgee",
  "кай": "kaiyi", "кайи": "kaiyi", "kaiyi": "kaiyi",
};

const NON_CATALOG_BRANDS: Record<string, string> = {
  "лада": "Lada (АвтоВАЗ)", "ваз": "ВАЗ", "жигули": "Lada", "lada": "Lada",
  "бмв": "BMW", "bmw": "BMW", "мерседес": "Mercedes-Benz", "mercedes": "Mercedes-Benz",
  "ауди": "Audi", "audi": "Audi", "тойота": "Toyota", "toyota": "Toyota",
  "киа": "KIA", "kia": "KIA", "хендай": "Hyundai", "хёндай": "Hyundai", "hyundai": "Hyundai",
  "тесла": "Tesla", "tesla": "Tesla", "тенет": "Tenet", "tenet": "Tenet",
};

function parsePrice(text: string): number | null {
  const clean = text.toLowerCase().replace(/,/g, ".");
  const words: Record<string, number> = {
    "одного": 1, "один": 1, "двух": 2, "два": 2, "трех": 3, "три": 3,
    "четырех": 4, "четыре": 4, "пяти": 5, "пять": 5, "шести": 6, "шесть": 6,
    "семи": 7, "семь": 7, "восьми": 8, "восемь": 8, "миллион": 1, "миллиона": 1, "млн": 1,
  };

  if (clean.includes("до миллиона") || clean.includes("до 1 млн") || clean.includes("до 1000000")) return 1000000;
  for (const [w, n] of Object.entries(words)) {
    if (n > 1 && new RegExp(`до\\s+${w}\\s*(млн|миллион|миллиона|миллионов)?`, "i").test(clean)) return n * 1000000;
  }
  const mlnMatch = clean.match(/(?:до|бюджет|дешевле|до)?\s*(\d+(?:\.\d+)?)\s*(?:млн|кк|миллион|миллиона|миллионов|m|mln)/i);
  if (mlnMatch) return parseFloat(mlnMatch[1]) * 1000000;
  const rawNumMatch = clean.replace(/\s/g, "").match(/(?:до|дешевле)?(\d{6,8})/i);
  if (rawNumMatch) return parseInt(rawNumMatch[1], 10);
  const thMatch = clean.match(/(?:до|дешевле)?\s*(\d+(?:\.\d+)?)\s*(?:тыс|тысяч|к|k)/i);
  if (thMatch) return parseFloat(thMatch[1]) * 1000;
  return null;
}

function findCities(text: string, regions: string[]): string[] {
  const clean = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, " ");
  const words = clean.split(/\s+/).filter(Boolean);
  const matched: string[] = [];

  for (const city of regions) {
    const cityLower = city.toLowerCase();
    if (clean.includes(cityLower)) {
      matched.push(city);
      continue;
    }
    const stem = cityLower.length > 4 ? cityLower.slice(0, -1) : cityLower;
    const shortStem = cityLower.length > 5 ? cityLower.slice(0, -2) : stem;
    if (words.some((w) => w.length >= 3 && (w.startsWith(stem) || w.startsWith(shortStem)))) {
      matched.push(city);
    }
  }
  return matched;
}

function runFallbackParser(userQuery: string, availableRegions: string[]): AIAnalysisResult {
  const lower = userQuery.toLowerCase();
  
  for (const [alias, canonical] of Object.entries(NON_CATALOG_BRANDS)) {
    if (new RegExp(`\\b${alias}[а-яa-z]*\\b`, "i").test(lower) || lower.includes(alias)) {
      return {
        replyText: `Мяу! Бренд «${canonical}» в нашем каталоге отсутствует. 🐾\nМы специализируемся исключительно на современных китайских авто (Geely, Haval, Zeekr, Chery, Changan, TANK, Li Auto и др.).`,
      };
    }
  }

  let targetBrand: string | undefined = undefined;
  for (const [alias, brand] of Object.entries(BRAND_ALIASES)) {
    if (new RegExp(`\\b${alias}[а-яa-z]*\\b`, "i").test(lower) || lower.includes(alias)) {
      targetBrand = brand;
      break;
    }
  }

  const cities = findCities(lower, availableRegions);
  const maxPrice = parsePrice(lower);
  const isAskingCityList = lower.includes("город") || lower.includes("где есть") || lower.includes("где купить") || lower.includes("в каких");

  let bodyType: string | undefined = undefined;
  if (lower.includes("кроссовер") || lower.includes("suv") || lower.includes("внедорожник")) bodyType = "кроссовер";
  if (lower.includes("седан")) bodyType = "седан";

  const parts: string[] = [];
  if (targetBrand) parts.push(`бренда ${targetBrand.toUpperCase()}`);
  if (cities.length > 0) parts.push(`в городах: ${cities.join(", ")}`);
  if (maxPrice) parts.push(`до ${(maxPrice / 1000000).toFixed(1).replace(".0", "")} млн ₽`);
  if (bodyType) parts.push(`тип кузова: ${bodyType}`);

  const replyText = parts.length > 0
    ? `Мяу! Нашел варианты по параметрам (${parts.join(", ")}): 🐾`
    : `Мяу! Вот доступные автомобили по запросу «${userQuery}»: 🐾`;

  return {
    replyText,
    targetCities: cities.length > 0 ? cities : undefined,
    targetBrand,
    maxPrice: maxPrice || undefined,
    bodyType,
    isAskingCityList,
  };
}

export async function askCatAI(
  userQuery: string,
  availableRegions: string[],
  availableBrands: string[]
): Promise<AIAnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Ты — «Auto.ru Пука кот ассистент AI» для сайта китайских авто. Верни СТРОГИЙ JSON:
{
  "replyText": "ответ кота с мяу и 🐾",
  "targetCities": ["Город1"],
  "targetBrand": "brand_name_en",
  "maxPrice": 2000000,
  "bodyType": "suv" | "sedan",
  "isAskingCityList": true
}
Города в базе: ${availableRegions.join(", ")}
Бренды в базе: ${availableBrands.join(", ")}
Запрос: "${userQuery}"`,
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

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return JSON.parse(text);
      }
    } catch (e) {
      console.warn("Gemini недоступен, переключаемся на локальный NLP-парсер:", e);
    }
  }

  return runFallbackParser(userQuery, availableRegions);
}
