import { useState, useRef, useEffect } from "react";
import { getRegions, getBrandsByRegion } from "../../services/regionCoverage";
import { loadCatalog } from "../../services/catalog";
import { Car } from "../../types/car";

interface Message {
  sender: "bot" | "user";
  text: string;
  cars?: Car[];
  foundCity?: string;
}

interface CatAssistantProps {
  onNavigateToRegions?: (city?: string) => void;
  onNavigateToCatalog?: () => void;
}

// Словарь сопоставления русских и альтернативных названий брендов
const BRAND_ALIASES: Record<string, string> = {
  "зикри": "zeekr",
  "зикро": "zeekr",
  "зикр": "zeekr",
  "зеекр": "zeekr",
  "zeekr": "zeekr",
  "джили": "geely",
  "гили": "geely",
  "geely": "geely",
  "хавал": "haval",
  "хавейл": "haval",
  "haval": "haval",
  "чери": "chery",
  "черей": "chery",
  "chery": "chery",
  "омода": "omoda",
  "omoda": "omoda",
  "джейку": "jaecoo",
  "джаеку": "jaecoo",
  "jaecoo": "jaecoo",
  "эксид": "exeed",
  "эксит": "exeed",
  "exeed": "exeed",
  "танк": "tank",
  "тэнк": "tank",
  "tank": "tank",
  "гак": "gac",
  "gac": "gac",
  "чанган": "changan",
  "чанъань": "changan",
  "changan": "changan",
  "джетур": "jetour",
  "jetour": "jetour",
  "байк": "baic",
  "баик": "baic",
  "baic": "baic",
  "донгфенг": "dongfeng",
  "донфенг": "dongfeng",
  "dongfeng": "dongfeng",
  "хунци": "hongqi",
  "хончи": "hongqi",
  "hongqi": "hongqi",
  "воя": "voyah",
  "воях": "voyah",
  "voyah": "voyah",
  "лисян": "lixiang",
  "ли": "lixiang",
  "ли9": "lixiang",
  "ли7": "lixiang",
  "lixiang": "lixiang",
  "li auto": "lixiang",
  "бид": "byd",
  "буд": "byd",
  "byd": "byd",
};

// Функция парсинга бюджета из строки (напр: "до 3 млн", "до 2.5кк", "до 4000000")
function parseMaxPrice(text: string): number | null {
  const clean = text.toLowerCase().replace(/[,]/g, ".");

  // "до 3.5 млн" / "до 3 млн" / "до 3млн"
  const mlnMatch = clean.match(/(?:до|бюджет|дешевле|до)?\s*(\d+(?:\.\d+)?)\s*(?:млн|кк|миллион|миллиона|миллионов|m|mln)/i);
  if (mlnMatch) {
    return parseFloat(mlnMatch[1]) * 1000000;
  }

  // "до 2500000" / "до 3 000 000"
  const rawNumMatch = clean.replace(/\s/g, "").match(/(?:до|дешевле)?(\d{6,8})/i);
  if (rawNumMatch) {
    return parseInt(rawNumMatch[1], 10);
  }

  // "до 500 тыс" / "до 800к"
  const thMatch = clean.match(/(?:до|дешевле)?\s*(\d+(?:\.\d+)?)\s*(?:тыс|тысяч|к|k)/i);
  if (thMatch) {
    return parseFloat(thMatch[1]) * 1000;
  }

  return null;
}

export default function CatAssistant({
  onNavigateToRegions,
  onNavigateToCatalog,
}: CatAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Привет! 🐾 Я твой умный авто-ассистент Авто.ру. Можешь спросить:\n• «машины в Краснодаре»\n• «покажи все Зикр»\n• «авто до 3 млн»\n• «кроссоверы до 4 млн в Москве»",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    const query = input.trim();
    if (!query) return;

    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setInput("");
    setIsTyping(true);

    try {
      const lowerQuery = query.toLowerCase();
      const [allRegions, allCars] = await Promise.all([
        getRegions(),
        loadCatalog(),
      ]);

      let filteredList = [...allCars];
      const matchedFilters: string[] = [];

      // 1. Поиск города
      const matchedCity = allRegions.find((city) =>
        lowerQuery.includes(city.toLowerCase())
      );

      if (matchedCity) {
        const availableBrands = await getBrandsByRegion(matchedCity);
        const brandSet = new Set(availableBrands.map((b) => b.trim().toLowerCase()));
        filteredList = filteredList.filter((car) =>
          brandSet.has(car.brand?.name?.trim().toLowerCase())
        );
        matchedFilters.push(`в г. ${matchedCity}`);
      }

      // 2. Поиск бренда (RU / EN алиасы)
      let foundBrandTarget: string | null = null;
      for (const [alias, targetBrand] of Object.entries(BRAND_ALIASES)) {
        if (new RegExp(`\\b${alias}\\b`, "i").test(lowerQuery) || lowerQuery.includes(alias)) {
          foundBrandTarget = targetBrand;
          break;
        }
      }

      if (foundBrandTarget) {
        filteredList = filteredList.filter((car) => {
          const bName = car.brand?.name?.toLowerCase() || "";
          const mName = car.model?.toLowerCase() || "";
          return bName.includes(foundBrandTarget!) || mName.includes(foundBrandTarget!);
        });
        matchedFilters.push(`бренда ${foundBrandTarget.toUpperCase()}`);
      }

      // 3. Поиск по бюджету ("до X млн")
      const maxPrice = parseMaxPrice(lowerQuery);
      if (maxPrice) {
        filteredList = filteredList.filter((car) => {
          const carPrice = car.priceFrom || car.priceTo || 0;
          return carPrice > 0 ? carPrice <= maxPrice : true;
        });
        matchedFilters.push(`до ${(maxPrice / 1000000).toFixed(1).replace(".0", "")} млн ₽`);
      }

      // 4. Поиск по кузову (кроссовер, седан, внедорожник)
      if (lowerQuery.includes("кроссовер") || lowerQuery.includes("suv")) {
        filteredList = filteredList.filter(
          (c) => c.body?.toLowerCase().includes("suv") || c.body?.toLowerCase().includes("кроссовер")
        );
        matchedFilters.push("в кузове кроссовер");
      } else if (lowerQuery.includes("седан")) {
        filteredList = filteredList.filter(
          (c) => c.body?.toLowerCase().includes("седан") || c.body?.toLowerCase().includes("sedan")
        );
        matchedFilters.push("седан");
      }

      // 5. Если фильтры не сработали, производим общий нечеткий поиск
      if (matchedFilters.length === 0) {
        filteredList = filteredList.filter((c) => {
          const fullCarName = `${c.brand?.name || ""} ${c.model || ""}`.toLowerCase();
          return fullCarName.includes(lowerQuery);
        });
      }

      setTimeout(() => {
        setIsTyping(false);
        if (filteredList.length > 0) {
          const filterSummary = matchedFilters.length > 0 ? ` (${matchedFilters.join(", ")})` : "";
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: `Мяу! Найдено ${filteredList.length} авто${filterSummary}:`,
              cars: filteredList.slice(0, 6),
              foundCity: matchedCity,
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: `По запросу «${query}» ничего не найдено. Попробуй изменить параметры (например: «Хавейл до 3 млн» или «авто в Краснодаре»)! 🐾`,
            },
          ]);
        }
      }, 500);
    } catch (e) {
      console.error(e);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Произошла ошибка при поиске. Попробуй еще разок!" },
      ]);
    }
  };

  return (
    <div className="fixed bottom-8 left-8 z-50">
      <style>{`
        @keyframes catFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-7px) rotate(-1.5deg); }
        }
        @keyframes scarfWave {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(12deg); }
        }
        @keyframes catTail {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-14deg); }
        }
        .animate-cat-fluffy {
          animation: catFloat 3.8s ease-in-out infinite;
        }
        .animate-scarf {
          transform-origin: top left;
          animation: scarfWave 2.2s ease-in-out infinite;
        }
        .animate-fluffy-tail {
          transform-origin: bottom right;
          animation: catTail 2.4s ease-in-out infinite;
        }
      `}</style>

      {/* ЧАТ-ОКНО СЛЕВА */}
      {isOpen && (
        <div className="mb-4 flex h-[520px] w-[350px] sm:w-[410px] flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-[#0c1017]/95">
          {/* Шапка чата */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 text-lg text-white shadow-md shadow-red-500/25">
                🐱
              </div>
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
                  <span>Авто.ру Кот</span>
                  <span className="rounded-md bg-red-500/10 px-1.5 py-0.5 text-[9px] font-black text-red-500">AI SMART</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Поиск по городам, ценам и маркам
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-200/60 dark:hover:bg-white/10 dark:text-slate-300"
            >
              ✕
            </button>
          </div>

          {/* Список сообщений */}
          <div className="flex-1 space-y-3.5 overflow-y-auto p-4 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "rounded-br-sm bg-gradient-to-r from-red-600 to-rose-500 font-semibold text-white"
                      : "rounded-bl-sm border border-slate-200/80 bg-slate-100 text-slate-800 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200"
                  }`}
                >
                  {m.text}
                </div>

                {m.cars && m.cars.length > 0 && (
                  <div className="mt-2.5 w-full space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {m.cars.map((car) => (
                        <div
                          key={car.id}
                          className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition hover:border-red-500 dark:border-white/10 dark:bg-white/[0.03]"
                        >
                          <div>
                            <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                              {car.brand?.name} {car.model}
                            </div>
                            <div className="text-[9px] text-slate-400 capitalize">
                              {car.body || "Кроссовер"}
                            </div>
                          </div>
                          <div className="mt-2 text-[10px] font-semibold text-red-500 dark:text-rose-400">
                            {car.priceFrom
                              ? `от ${car.priceFrom.toLocaleString()} ₽`
                              : car.priceTo
                              ? `до ${car.priceTo.toLocaleString()} ₽`
                              : "По запросу"}
                          </div>
                        </div>
                      ))}
                    </div>

                    {m.foundCity && onNavigateToRegions && (
                      <button
                        onClick={() => {
                          onNavigateToRegions(m.foundCity);
                          setIsOpen(false);
                        }}
                        className="w-full rounded-xl bg-red-50 py-2 text-center text-[11px] font-bold text-red-600 transition hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                      >
                        Открыть каталог дилеров в «{m.foundCity}» →
                      </button>
                    )}

                    {!m.foundCity && onNavigateToCatalog && (
                      <button
                        onClick={() => {
                          onNavigateToCatalog();
                          setIsOpen(false);
                        }}
                        className="w-full rounded-xl bg-slate-100 py-2 text-center text-[11px] font-bold text-slate-700 transition hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300 dark:hover:bg-white/20"
                      >
                        Перейти в общий каталог →
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Быстрые подсказки / теги */}
          <div className="flex gap-1.5 overflow-x-auto px-4 py-2 border-t border-slate-100 dark:border-white/[0.05]">
            {["Зикр", "до 3 млн", "Краснодар", "Хавейл", "Кроссоверы"].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setInput(tag)}
                className="whitespace-nowrap rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-500 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/10"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Поле ввода */}
          <div className="border-t border-slate-100 p-3 dark:border-white/[0.08] dark:bg-white/[0.02]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Спроси: «Джили до 3 млн», «машины в Москве»..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-red-500 dark:border-white/10 dark:bg-[#06080d] dark:text-white"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-600 text-white shadow-md transition hover:bg-red-500"
              >
                ➔
              </button>
            </form>
          </div>
        </div>
      )}

      {/* КНОПКА: СЕРЫЙ ПУШИСТЫЙ КОТ В ШАРФИКЕ AUTO.RU */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-slate-900/85 shadow-[0_15px_35px_rgba(0,0,0,0.5)] backdrop-blur-2xl transition-all duration-300 hover:scale-110 hover:border-red-500"
      >
        <div className="absolute -top-1 -right-1 flex items-center gap-1 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-black tracking-wider text-white shadow-[0_0_12px_#ef4444]">
          <span>AUTO.RU</span>
        </div>

        <svg
          viewBox="0 0 100 100"
          className="h-16 w-16 animate-cat-fluffy"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Хвостик */}
          <path
            d="M 68 76 C 88 74 92 50 82 44 C 74 38 72 48 70 60"
            stroke="url(#furGradDark)"
            strokeWidth="8"
            strokeLinecap="round"
            className="animate-fluffy-tail"
          />

          {/* Тело */}
          <path
            d="M 26 84 C 24 58 76 58 74 84 Z"
            fill="url(#furGrad)"
          />

          {/* Голова */}
          <circle cx="50" cy="46" r="23" fill="url(#furGrad)" />

          {/* Щечки */}
          <path d="M 27 50 L 21 54 L 28 58 L 22 63 L 31 64" fill="url(#furGrad)" />
          <path d="M 73 50 L 79 54 L 72 58 L 78 63 L 69 64" fill="url(#furGrad)" />

          {/* Ушки */}
          <polygon points="30,32 39,14 49,28" fill="#64748b" />
          <polygon points="34,29 40,18 46,27" fill="#f472b6" />

          <polygon points="70,32 61,14 51,28" fill="#64748b" />
          <polygon points="66,29 60,18 54,27" fill="#f472b6" />

          {/* Глазки */}
          <ellipse cx="41" cy="43" rx="4.5" ry="5.5" fill="#10b981" />
          <ellipse cx="59" cy="43" rx="4.5" ry="5.5" fill="#10b981" />
          <circle cx="41" cy="43" r="3.2" fill="#0f172a" />
          <circle cx="59" cy="43" r="3.2" fill="#0f172a" />
          <circle cx="39.5" cy="41" r="1.5" fill="#ffffff" />
          <circle cx="57.5" cy="41" r="1.5" fill="#ffffff" />

          {/* Носик */}
          <polygon points="48,51 52,51 50,53.5" fill="#fb7185" />
          <path d="M 46 55 Q 50 58 54 55" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" />

          {/* Усики */}
          <line x1="28" y1="52" x2="16" y2="50" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="28" y1="55" x2="15" y2="56" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="72" y1="52" x2="84" y2="50" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="72" y1="55" x2="85" y2="56" stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />

          {/* Красный зимний шарфик */}
          <rect x="33" y="62" width="34" height="9" rx="4.5" fill="#ef4444" stroke="#b91c1c" strokeWidth="1" />
          <path
            d="M 40 68 L 36 85 L 45 85 L 47 68 Z"
            fill="#dc2626"
            stroke="#991b1b"
            strokeWidth="0.8"
            className="animate-scarf"
          />
          <line x1="37" y1="85" x2="37" y2="88" stroke="#fecaca" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="40" y1="85" x2="40" y2="88" stroke="#fecaca" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="44" y1="85" x2="44" y2="88" stroke="#fecaca" strokeWidth="1.2" strokeLinecap="round" />

          <defs>
            <linearGradient id="furGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#cbd5e1" />
              <stop offset="0.6" stopColor="#94a3b8" />
              <stop offset="1" stopColor="#64748b" />
            </linearGradient>
            <linearGradient id="furGradDark" x1="60" y1="40" x2="90" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#94a3b8" />
              <stop offset="1" stopColor="#475569" />
            </linearGradient>
          </defs>
        </svg>
      </button>
    </div>
  );
}
