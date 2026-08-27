{/* КНОПКА ОТКРЫТИЯ С ОБЪЕМНЫМ 3D НЕО-КОТОМ */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-gradient-to-b from-slate-800/95 to-[#080d1a]/95 shadow-[0_15px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(239,68,68,0.25)] backdrop-blur-2xl transition-all duration-300 hover:scale-110 hover:border-red-500/80 hover:shadow-[0_20px_45px_rgba(239,68,68,0.4)]"
      >
        {/* Неоновый бейдж AUTO.RU */}
        <div className="absolute -top-1 -right-1 z-10 flex items-center gap-1 rounded-full bg-gradient-to-r from-red-600 via-rose-500 to-red-600 px-2.5 py-0.5 text-[9px] font-black tracking-wider text-white shadow-[0_2px_12px_rgba(239,68,68,0.6)] border border-white/30">
          <span>AUTO.RU</span>
        </div>

        {/* 3D SVG Кот */}
        <svg
          viewBox="0 0 120 120"
          className="h-16 w-16 drop-shadow-[0_8px_16px_rgba(0,0,0,0.45)] transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Градиенты шерсти */}
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

            {/* Градиент шарфа */}
            <linearGradient id="scarfGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d4d" />
              <stop offset="50%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </linearGradient>

            {/* Градиенты глаз */}
            <radialGradient id="eyeGrad" cx="45%" cy="40%" r="55%">
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="60%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#047857" />
            </radialGradient>

            {/* Фильтр мягкого свечения */}
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Хвост с объемом */}
          <path
            d="M 82 92 C 108 90 114 60 98 48 C 88 40 84 54 84 70"
            stroke="url(#catBodyGrad)"
            strokeWidth="10"
            strokeLinecap="round"
            className="animate-fluffy-tail"
          />

          {/* Тело */}
          <ellipse cx="60" cy="92" rx="30" ry="22" fill="url(#catBodyGrad)" />

          {/* Левое ухо */}
          <path
            d="M 34 46 L 44 20 C 46 16 52 18 54 24 L 56 42 Z"
            fill="url(#catHeadGrad)"
          />
          <path
            d="M 39 42 L 46 25 C 47 23 50 24 51 27 L 53 40 Z"
            fill="url(#earInner)"
            opacity="0.9"
          />

          {/* Правое ухо */}
          <path
            d="M 86 46 L 76 20 C 74 16 68 18 66 24 L 64 42 Z"
            fill="url(#catHeadGrad)"
          />
          <path
            d="M 81 42 L 74 25 C 73 23 70 24 69 27 L 67 40 Z"
            fill="url(#earInner)"
            opacity="0.9"
          />

          {/* Голова (сферический объем) */}
          <circle cx="60" cy="54" r="28" fill="url(#catHeadGrad)" />

          {/* Щечки (пушистость) */}
          <path d="M 33 60 C 26 56 26 68 35 68 Z" fill="url(#catHeadGrad)" />
          <path d="M 87 60 C 94 56 94 68 85 68 Z" fill="url(#catHeadGrad)" />

          {/* Левый глаз */}
          <ellipse cx="48" cy="50" rx="6.5" ry="8" fill="#0f172a" />
          <ellipse cx="48" cy="50" rx="5.5" ry="7" fill="url(#eyeGrad)" />
          <ellipse cx="48" cy="50" rx="3" ry="5.5" fill="#090d16" />
          {/* Блики в глазу */}
          <circle cx="46" cy="47" r="2" fill="#ffffff" />
          <circle cx="50" cy="53" r="1" fill="#ffffff" opacity="0.8" />

          {/* Правый глаз */}
          <ellipse cx="72" cy="50" rx="6.5" ry="8" fill="#0f172a" />
          <ellipse cx="72" cy="50" rx="5.5" ry="7" fill="url(#eyeGrad)" />
          <ellipse cx="72" cy="50" rx="3" ry="5.5" fill="#090d16" />
          {/* Блики в глазу */}
          <circle cx="70" cy="47" r="2" fill="#ffffff" />
          <circle cx="74" cy="53" r="1" fill="#ffffff" opacity="0.8" />

          {/* Носик (3D сердечко) */}
          <path
            d="M 57 60 C 57 58 63 58 63 60 C 63 62 60 64 60 64 C 60 64 57 62 57 60 Z"
            fill="#f43f5e"
          />

          {/* Ротик */}
          <path
            d="M 55 64 Q 60 68 65 64"
            stroke="#475569"
            strokeWidth="1.8"
            strokeLinecap="round"
          />

          {/* Усы с легким свечением */}
          <g stroke="#ffffff" strokeWidth="1.2" strokeLinecap="round" opacity="0.85">
            <line x1="36" y1="58" x2="18" y2="55" />
            <line x1="35" y1="62" x2="16" y2="63" />
            <line x1="84" y1="58" x2="102" y2="55" />
            <line x1="85" y1="62" x2="104" y2="63" />
          </g>

          {/* Объемный вязаный шарф (воротник) */}
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
          {/* Текстура складок шарфа */}
          <line x1="48" y1="74" x2="48" y2="84" stroke="#fecaca" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
          <line x1="60" y1="74" x2="60" y2="84" stroke="#fecaca" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
          <line x1="72" y1="74" x2="72" y2="84" stroke="#fecaca" strokeWidth="1" opacity="0.4" strokeLinecap="round" />

          {/* Свисающий хвостик шарфа */}
          <path
            d="M 46 80 L 40 102 C 40 104 49 105 52 102 L 55 80 Z"
            fill="url(#scarfGrad)"
            stroke="#7f1d1d"
            strokeWidth="0.8"
            className="animate-scarf"
          />
          {/* Бахрома */}
          <line x1="42" y1="102" x2="42" y2="106" stroke="#fecaca" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="46" y1="103" x2="46" y2="107" stroke="#fecaca" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="50" y1="102" x2="50" y2="106" stroke="#fecaca" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
