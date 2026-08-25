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
      text: "Привет! 🐾 Я твой авто-ассистент. Напиши, например: «какие машины есть в Краснодаре» или «найди Zeekr».",
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

      // 1. Поиск по городам
      const matchedCity = allRegions.find((city) =>
        lowerQuery.includes(city.toLowerCase())
      );

      if (matchedCity) {
        const availableBrands = await getBrandsByRegion(matchedCity);
        const brandSet = new Set(availableBrands.map((b) => b.trim().toLowerCase()));

        const foundCars = allCars.filter((car) =>
          brandSet.has(car.brand?.name?.trim().toLowerCase())
        );

        setTimeout(() => {
          setIsTyping(false);
          if (foundCars.length > 0) {
            setMessages((prev) => [
              ...prev,
              {
                sender: "bot",
                text: `Мяу! Найдено ${foundCars.length} авто в г. ${matchedCity}:`,
                cars: foundCars.slice(0, 4),
                foundCity: matchedCity,
              },
            ]);
          } else {
            setMessages((prev) => [
              ...prev,
              {
                sender: "bot",
                text: `В городе ${matchedCity} пока нет доступных дилерских автомобилей. 🐾`,
              },
            ]);
          }
        }, 500);
        return;
      }

      // 2. Поиск по названию модели / бренду
      const filteredByModel = allCars.filter(
        (c) =>
          (c.model && c.model.toLowerCase().includes(lowerQuery)) ||
          (c.brand?.name && c.brand.name.toLowerCase().includes(lowerQuery))
      );

      setTimeout(() => {
        setIsTyping(false);
        if (filteredByModel.length > 0) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: `Вот что я нашел в каталоге:`,
              cars: filteredByModel.slice(0, 4),
            },
          ]);
        } else {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: `Не удалось найти совпадений по «${query}». Попробуй указать конкретный город (например: «Москва») или марку авто! 🐾`,
            },
          ]);
        }
      }, 500);
    } catch (e) {
      console.error(e);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Произошла ошибка при поиске. Попробуй еще раз!" },
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <style>{`
        @keyframes catFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(2deg); }
        }
        @keyframes catTail {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(15deg); }
        }
        .animate-cat {
          animation: catFloat 3.5s ease-in-out infinite;
        }
        .animate-tail {
          transform-origin: bottom left;
          animation: catTail 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* ЧАТ-ОКНО */}
      {isOpen && (
        <div className="mb-4 flex h-[480px] w-[350px] sm:w-[390px] flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/95 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-2xl transition-all duration-300 dark:border-white/10 dark:bg-[#0c1017]/95">
          {/* Шапка чата */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-5 py-4 dark:border-white/[0.08] dark:bg-white/[0.03]">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-sky-400 text-lg shadow-md shadow-blue-500/25">
                🐱
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  KAGE Cat AI
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Онлайн-помощник
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

          {/* Сообщения */}
          <div className="flex-1 space-y-3.5 overflow-y-auto p-4 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                    m.sender === "user"
                      ? "rounded-br-sm bg-gradient-to-r from-blue-600 to-sky-500 font-semibold text-white"
                      : "rounded-bl-sm border border-slate-200/80 bg-slate-100 text-slate-800 dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200"
                  }`}
                >
                  {m.text}
                </div>

                {/* Список авто */}
                {m.cars && m.cars.length > 0 && (
                  <div className="mt-2.5 w-full space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      {m.cars.map((car) => (
                        <div
                          key={car.id}
                          className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm transition hover:border-blue-500 dark:border-white/10 dark:bg-white/[0.03]"
                        >
                          <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                            {car.brand?.name} {car.model}
                          </div>
                          <div className="mt-1 text-[10px] font-semibold text-sky-500">
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
                        className="w-full rounded-xl bg-blue-50 py-2 text-center text-[11px] font-bold text-blue-600 transition hover:bg-blue-100 dark:bg-sky-500/10 dark:text-sky-400 dark:hover:bg-sky-500/20"
                      >
                        Перейти к региону «{m.foundCity}» →
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

          {/* Ввод сообщения */}
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
                placeholder="Спроси кота (напр: авто в Краснодаре)..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 outline-none transition focus:border-blue-500 dark:border-white/10 dark:bg-[#06080d] dark:text-white"
              />
              <button
                type="submit"
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition hover:bg-blue-500"
              >
                ➔
              </button>
            </form>
          </div>
        </div>
      )}

      {/* КНОПКА-КОТИК */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-[#0c1017]/80 shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-sky-400"
      >
        <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-sky-400 text-[10px] font-extrabold text-white shadow-[0_0_10px_#38bdf8]">
          AI
        </div>

        <svg
          viewBox="0 0 100 100"
          className="h-11 w-11 animate-cat"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 28 75 C 10 75 10 50 20 45"
            stroke="#38bdf8"
            strokeWidth="5"
            strokeLinecap="round"
            className="animate-tail"
          />
          <path
            d="M 30 82 C 30 55 70 55 70 82 Z"
            fill="url(#catGrad)"
          />
          <circle cx="50" cy="46" r="22" fill="url(#catGrad)" />
          <polygon points="32,32 40,16 48,30" fill="#38bdf8" />
          <polygon points="68,32 60,16 52,30" fill="#38bdf8" />
          <ellipse cx="42" cy="44" rx="3" ry="4" fill="#ffffff" />
          <ellipse cx="58" cy="44" rx="3" ry="4" fill="#ffffff" />
          <circle cx="43" cy="44" r="2" fill="#0c1017" />
          <circle cx="57" cy="44" r="2" fill="#0c1017" />
          <polygon points="48,51 52,51 50,53" fill="#f43f5e" />
          <path d="M 46 55 Q 50 58 54 55" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />

          <defs>
            <linearGradient id="catGrad" x1="30" y1="20" x2="70" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0284c7" />
              <stop offset="1" stopColor="#0f172a" />
            </linearGradient>
          </defs>
        </svg>
      </button>
    </div>
  );
}
