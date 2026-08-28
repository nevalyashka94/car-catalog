import Cat3DView from './Cat3DView';
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

      if (aiResult.targetBrand) {
        const tb = aiResult.targetBrand.toLowerCase();
        filteredCars = filteredCars.filter((c) => {
          const bName = c.brand?.name?.toLowerCase() || "";
          const mName = c.model?.toLowerCase() || "";
          return bName.includes(tb) || mName.includes(tb);
        });
        filterPayload.brand = aiResult.targetBrand;
      }

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

      if (aiResult.bodyType) {
        filteredCars = filteredCars.filter((c) =>
          c.body?.toLowerCase().includes(aiResult.bodyType!)
        );
        filterPayload.body = aiResult.bodyType;
      }

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
        @keyframes voiceRing {
          0% { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes neonHalo {
          0%, 100% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.4), 0 0 45px rgba(239, 68, 68, 0.2); }
          50% { box-shadow: 0 0 35px rgba(239, 68, 68, 0.7), 0 0 65px rgba(239, 68, 68, 0.4); }
        }
        .animate-voice-ring-1 {
          animation: voiceRing 1.6s cubic-bezier(0, 0.2, 0.8, 1) infinite;
        }
        .animate-voice-ring-2 {
          animation: voiceRing 1.6s cubic-bezier(0, 0.2, 0.8, 1) infinite 0.5s;
        }
        .animate-neon-halo {
          animation: neonHalo 3s ease-in-out infinite;
        }
      `}</style>

      {/* Окно чата */}
      {isOpen && (
        <div className="mb-4 flex h-[540px] w-[350px] sm:w-[420px] flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-[#0c1017]/95">
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-red-500/40 bg-slate-900 shadow-md shadow-red-500/25">
                <Cat3DView isTyping={isTyping} />
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
                  {isTyping ? "Кот печатает ответ..." : "Умный подбор по любым запросам"}
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

      {/* Плавающая кнопка с неоновой шапкой AUTO.RU и 3D котом */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Открыть AI ассистент"
        className="group relative flex h-24 w-24 items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
      >
        {isTyping && (
          <>
            <div className="animate-voice-ring-1 absolute inset-0 rounded-full border border-sky-400/60" />
            <div className="animate-voice-ring-2 absolute inset-0 rounded-full border border-red-500/60" />
          </>
        )}

        <div className="animate-neon-halo absolute inset-1 rounded-full bg-gradient-to-tr from-red-600/40 via-rose-500/25 to-sky-500/25 blur-md transition-all duration-500 group-hover:inset-0 group-hover:blur-xl" />

        {/* Капсула аватара */}
        <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-red-500/50 bg-[#090d16] p-0.5 shadow-[0_15px_35px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:border-red-500">
          
          {/* Горящая неоновая плашка AUTO.RU сверху */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none rounded-full bg-red-600/90 px-2 py-0.5 shadow-[0_0_12px_#ef4444] border border-red-400/50">
            <span className="text-[8px] font-black tracking-widest text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              AUTO.RU
            </span>
          </div>

          {/* 3D Серый кот */}
          <Cat3DView isTyping={isTyping} />

          {/* Стеклянный блик */}
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-80" />
        </div>

        {/* Индикатор онлайна */}
        <div className="absolute bottom-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#06080d] border border-white/20 z-20">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping" />
          <span className="absolute h-2 w-2 rounded-full bg-emerald-500" />
        </div>
      </button>
    </div>
  );
}
