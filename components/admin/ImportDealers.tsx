console.log("Кнопка сработала");
import * as XLSX from "xlsx";
import { createDealer } from "../../services/dealers";

type ParsedDealer = {
  dealerGroup: string;
  dealerCode: string;
  name: string;
};

export default function ImportDealers() {
  const handleImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

    const dealers: ParsedDealer[] = [];

    let currentGroup = "";

    for (const row of rows) {
      const value = Object.values(row)[0];

      if (!value) continue;

      const text = String(value).trim();

      // Пропускаем заголовок
      if (text === "Названия строк") continue;

      // Если строка начинается с цифр — это группа
      if (/^\d+\s/.test(text)) {
        currentGroup = text;
        continue;
      }

      dealers.push({
        name: text,
        dealerCode: "",
        dealerGroup: currentGroup,
      });
    }

    console.log(dealers);

    let imported = 0;

    for (const dealer of dealers) {
      try {
        await createDealer(dealer);
        imported++;
      } catch (e) {
        console.error(e);
      }
    }

    alert(
      `Импорт завершён!\n\nДобавлено дилеров: ${imported}`
    );
  };

  return (
    <label
      className="
        cursor-pointer
        rounded-xl
        bg-indigo-600
        px-5
        py-3
        text-white
        hover:bg-indigo-700
      "
    >
      🏢 Импорт дилеров

      <input
        type="file"
        accept=".xlsx"
        hidden
        onChange={handleImport}
      />
    </label>
  );
}