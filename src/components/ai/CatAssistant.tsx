import { useState, useRef, useEffect } from "react";
import { getRegions, getBrandsByRegion } from "../../services/regionCoverage";
import { loadCatalog } from "../../services/catalog";
import { askCatAI, extractCityMatch } from "../../services/aiAssistant";
import { Car } from "../../types/car";

export interface CatalogFilterState {
  brand?: string;
  body?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
}

interface Message {
  sender: "bot" | "user";
  text: string;
  cars?: Car[];
  foundCity?: string;
  availableCities?: string[];
  filterPayload?: CatalogFilterState;
}

interface CatAssistantProps {
  onNavigateToRegions?: (city?: string) => void;
  onNavigateToCatalog?: (filters?: CatalogFilterState) => void;
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
      text: "Привет! 🐾 Я Auto.ru Пука кот ассистент AI.\n\nЗадай мне любой вопрос:\n• «машины от 800 тысяч до полутора миллионов»\n• «а какие в Краснодаре?»\n• «покажи все хавалы»",
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
      const [allRegions, allCars] = await Promise.all([
        getRegions(),
        loadCatalog(),
      ]);

      const allBrandNames = Array.from(
        new Set(allCars.map((c) => c.brand?.name).filter(Boolean))
      );

      const aiResult = await askCatAI(query, allRegions, allBrandNames);

      let filteredCars = [...allCars];
      const filterPayload: CatalogFilterState = {};

      // 1. Город
      let primaryCity: string | undefined = undefined;
      if (aiResult.targetCities && aiResult.targetCities.length > 0) {
        primaryCity = aiResult.targetCities[0];
      } else {
        primaryCity = extractCityMatch(query, allRegions);
      }

      if (primaryCity) {
        const brandsInCity = await getBrandsByRegion(primaryCity);
        const brandSet = new Set(brandsInCity.map((b) => b.toLowerCase().trim()));
        filteredCars = filteredCars.filter((c) =>
          brandSet.has(c.brand?.name?.toLowerCase().trim())
        );
      }

      // 2. Бренд
      if (aiResult.targetBrand) {
        const tb = aiResult.targetBrand.toLowerCase();
        filteredCars = filteredCars.filter((c) => {
          const bName = c.brand?.name?.toLowerCase() || "";
          const mName = c.model?.toLowerCase() || "";
          return bName.includes(tb) || mName.includes(tb);
        });
        filterPayload.brand = aiResult.targetBrand;
      }

      // 3. Бюджет (от и до)
      if (aiResult.minPrice || aiResult.maxPrice) {
        filteredCars = filteredCars.filter((c) => {
          const price = c.priceFrom || c.priceTo || 0;
          if (price === 0) return true;
          const matchMin = aiResult.minPrice ? price >= aiResult.minPrice : true;
          const matchMax = aiResult.maxPrice ? price <= aiResult.maxPrice : true;
          return matchMin && matchMax;
        });
        if (aiResult.minPrice) filterPayload.minPrice = aiResult.minPrice;
        if (aiResult.maxPrice) filterPayload.maxPrice = aiResult.maxPrice;
      }

      // 4. Кузов
      if (aiResult.bodyType) {
        filteredCars = filteredCars.filter((c) =>
          c.body?.toLowerCase().includes(aiResult.bodyType!)
        );
        filterPayload.body = aiResult.bodyType;
      }

      // 5. Поиск городов для бренда
      let cityListForBrand: string[] | undefined = undefined;
      if (aiResult.isAskingCityList && aiResult.targetBrand) {
        const tb = aiResult.targetBrand.toLowerCase();
        const matchingCities: string[] = [];
        await Promise.all(
          allRegions.map(async (city) => {
            const brands = await getBrandsByRegion(city);
            if (brands.some((b) => b.toLowerCase().includes(tb))) {
              matchingCities.push(city);
            }
          })
        );
        cityListForBrand = matchingCities;
      }

      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: aiResult.replyText,
          cars: filteredCars.length > 0 ? filteredCars.slice(0, 6) : undefined,
          foundCity: primaryCity,
          availableCities: cityListForBrand,
          filterPayload: Object.keys(filterPayload).length > 0 ? filterPayload : undefined,
        },
      ]);
    } catch (e) {
      console.error(e);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Мяу! Сейчас подберу варианты из каталога! 🐾",
        },
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

      {isOpen && (
        <div className="mb-4 flex h-[540px] w-[350px] sm:w-[420px] flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-[#0c1017]/95">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 text-lg text-white shadow-md shadow-red-500/25">
                🐱
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <span>Auto.ru Пука кот ассистент</span>
                  <span className="rounded-md bg-red-500/10 px-1.5 py-0.5 text-[9px] font-black text-red-500">
                    AI
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Умный подбор по любым запросам
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

                {m.availableCities && m.availableCities.length > 0 && onNavigateToRegions && (
                  <div className="mt-2.5 w-full rounded-2xl border border-slate-200/80 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/[0.03]">
                    <div className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Доступно в городах ({m.availableCities.length}):
                    </div>
                    <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto pr-1">
                      {m.availableCities.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            onNavigateToRegions(city);
                            setIsOpen(false);
                          }}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-800 transition hover:border-red-500 hover:text-red-500 dark:border-white/10 dark:bg-[#0c1017] dark:text-slate-300 dark:hover:border-red-500 dark:hover:text-red-400"
                        >
                          📍 {city}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

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
                        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 py-2.5 text-center text-[11px] font-extrabold text-white shadow-md shadow-blue-500/25 transition hover:opacity-95"
                      >
                        Показать дилеров в «{m.foundCity}» →
                      </button>
                    )}

                    {onNavigateToCatalog && (
                      <button
                        onClick={() => {
                          onNavigateToCatalog(m.filterPayload);
                          setIsOpen(false);
                        }}
                        className="w-full rounded-xl bg-gradient-to-r from-red-600 to-rose-500 py-2.5 text-center text-[11px] font-bold text-white shadow-md shadow-red-500/20 transition hover:opacity-95"
                      >
                        Показать результаты в каталоге →
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

          <div className="flex gap-1.5 overflow-x-auto px-4 py-2 border-t border-slate-100 dark:border-white/[0.05]">
            {[
              "машины от 800 тысяч до полутора миллионов",
              "а какие в Краснодаре?",
              "покажи все хавалы",
              "в каких городах есть белджи?",
            ].map((tag) => (
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
                placeholder="Спроси кота о любых машинах и городах..."
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

      {/* КНОПКА ОТКРЫТИЯ С ОБЪЕМНЫМ 3D НЕО-КОТОМ */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-gradient-to-b from-slate-800/95 to-[#080d1a]/95 shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(239,68,68,0.25)] backdrop-blur-2xl transition-all duration-300 hover:scale-110 hover:border-red-500/80 hover:shadow-[0_20px_45px_rgba(239,68,68,0.4)]"
      >
        <div className="absolute -top-1 -right-1 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-white shadow-[0_2px_12px_rgba(239,68,68,0.6)] border border-white/30">
          <span>AUTO.RU</span>
        </div>

        <svg
          viewBox="0 0 120 120"
          className="h-16 w-16 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id="catHeadGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#e2e8f0" />
              <stop offset="55%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
            <radialGradient id="catBodyGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#cbd5e1" />
              <stop offset="70%" stopColor="#64748b" />
              <stop offset="100%" stopColor="#334155" />
            </radialGradient>
            <linearGradient id="earInner" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fda4af" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>

            <linearGradient id="scarfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d4d" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>

            <radialGradient id="eyeGrad" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>

            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <path
            d="M 82 92 C 108 90 114 60 98 48 C 88 40 84 54 84 70"
            stroke="url(#catBodyGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            className="animate-fluffy-tail"
          />

          <ellipse cx="60" cy="92" rx="30" ry="22" fill="url(#catBodyGrad)" />

          <path
            d="M 34 46 L 44 20 C 46 16 52 18 54 24 L 56 42 Z"
            fill="url(#catHeadGrad)"
          />
          <path
            d="M 39 42 L 46 25 C 47 23 50 24 51 27 L 53 40 Z"
            fill="url(#earInner)"
            opacity="0.9"
          />

          <path
            d="M 86 46 L 76 20 C 74 16 68 18 66 24 L 64 42 Z"
            fill="url(#catHeadGrad)"
          />
          <path
            d="M 81 42 L 74 25 C 73 23 70 24 69 27 L 67 40 Z"
            fill="url(#earInner)"
            opacity="0.9"
          />

          <circle cx="60" cy="54" r="28" fill="url(#catHeadGrad)" />

          <path d="M 33 60 C 26 56 26 68 35 68 Z" fill="url(#catHeadGrad)" />
          <path d="M 87 60 C 94 56 94 68 85 68 Z" fill="url(#catHeadGrad)" />

          <ellipse cx="48" cy="50" rx="6.5" ry="8" fill="#0f172a" />
          <ellipse cx="48" cy="50" rx="5.5" ry="7" fill="url(#eyeGrad)" />
          <ellipse cx="48" cy="50" rx="3" ry="5.5" fill="#090d16" />
          <circle cx="46" cy="47" r="2" fill="#ffffff" />
          <circle cx="50" cy="53" r="1" fill="#ffffff" opacity="0.8" />

          <ellipse cx="72" cy="50" rx="6.5" ry="8" fill="#0f172a" />
          <ellipse cx="72" cy="50" rx="5.5" ry="7" fill="url(#eyeGrad)" />
          <ellipse cx="72" cy="50" rx="3" ry="5.5" fill="#090d16" />
          <circle cx="70" cy="47" r="2" fill="#ffffff" />
          <circle cx="74" cy="53" r="1" fill="#ffffff" opacity="0.8" />

          <path
            d="M 57 60 C 57 58 63 58 63 60 C 63 62 60 64 60 64 C 60 64 57 62 57 60 Z"
            fill="#f43f5e"
          />

          <path
            d="M 55 64 Q 60 68 65 64"
            stroke="#475569"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          <g stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
            <line x1="36" y1="58" x2="18" y2="55" />
            <line x1="35" y1="62" x2="16" y2="63" />
            <line x1="84" y1="58" x2="102" y2="55" />
            <line x1="85" y1="62" x2="104" y2="63" />
          </g>

          <rect
            x="36"
            y="72"
            width="48"
            height="14"
            rx="7"
            fill="url(#scarfGrad)"
            stroke="#7f1d1d"
            strokeWidth="1"
            filter="url(#softGlow)"
          />
          <line x1="48" y1="74" x2="48" y2="84" stroke="#fecaca" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
          <line x1="60" y1="74" x2="60" y2="84" stroke="#fecaca" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
          <line x1="72" y1="74" x2="72" y2="84" stroke="#fecaca" strokeWidth="1" opacity="0.4" strokeLinecap="round" />

          <path
            d="M 46 80 L 40 102 C 40 104 49 105 52 102 L 55 80 Z"
            fill="url(#scarfGrad)"
            stroke="#7f1d1d"
            strokeWidth="0.8"
            className="animate-scarf"
          />
          <line x1="42" y1="102" x2="42" y2="106" stroke="#fecaca" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="46" y1="103" x2="46" y2="107" stroke="#fecaca" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="50" y1="102" x2="50" y2="106" stroke="#fecaca" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
