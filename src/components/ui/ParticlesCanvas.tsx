export default function ParticlesCanvas() {
  // Генерируем фиксированный массив частичек со случайными параметрами
  const particles = Array.from({ length: 45 }).map((_, i) => ({
    id: i,
    size: Math.random() * 3 + 2, // размер 2-5px
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    duration: Math.random() * 8 + 5, // скорость падения 5-13s
    delay: Math.random() * 5,
    opacity: Math.random() * 0.7 + 0.3,
  }));

  return (
    <>
      <style>{`
        @keyframes floatSnow {
          0% {
            transform: translateY(-10vh) translateX(0) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: 0.9;
          }
          80% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(105vh) translateX(30px) scale(1.2);
            opacity: 0;
          }
        }
      `}</style>

      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        style={{ zIndex: 99999 }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-sky-200 dark:bg-white"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: p.left,
              top: p.top,
              opacity: p.opacity,
              boxShadow: "0 0 10px #38bdf8, 0 0 4px #fff",
              animation: `floatSnow ${p.duration}s linear infinite`,
              animationDelay: `-${p.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
}
