import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./layout/Layout";

export default function App() {
  return (
    <ThemeProvider>
      <Layout>
        <section className="space-y-4">
          <h1 className="text-5xl font-bold">
            Каталог китайских автомобилей
          </h1>

          <p className="text-slate-500 dark:text-slate-400">
            Современный каталог автомобилей с фильтрами,
            поиском и темной темой.
          </p>
        </section>
      </Layout>
    </ThemeProvider>
  );
}
