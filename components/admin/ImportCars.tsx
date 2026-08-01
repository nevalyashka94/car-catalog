import * as XLSX from "xlsx";
import { createCar } from "../../services/cars";

type ParsedCar = {
  brand: string;
  model: string;
  priceFrom: number;
  priceTo: number;
};

function parsePrices(text: string) {
  const numbers = text.match(/\d+(\.\d+)?/g);

  if (!numbers || numbers.length < 2) {
    return {
      from: 0,
      to: 0,
    };
  }

  return {
    from: Math.round(Number(numbers[0]) * 1_000_000),
    to: Math.round(Number(numbers[1]) * 1_000_000),
  };
}

export default function ImportCars() {
  const handleImport = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer);

    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
      header: 1,
    });

    const cars: ParsedCar[] = [];

    for (let row = 2; row < rows.length; row++) {
      const current = rows[row];

      if (!current) continue;

      for (let col = 0; col < 10; col += 2) {
        const modelCell = current[col];
        const priceCell = current[col + 1];

        if (!modelCell || !priceCell) continue;

        const fullName = String(modelCell).trim();

        const parts = fullName.split(" ");

        let brand = parts[0];
        let model = parts.slice(1).join(" ");

        if (brand === "Li" && parts[1] === "Auto") {
          brand = "Li Auto";
          model = parts.slice(2).join(" ");
        }

        const prices = parsePrices(String(priceCell));

        cars.push({
          brand,
          model,
          priceFrom: prices.from,
          priceTo: prices.to,
        });
      }
    }

    let imported = 0;

    for (const car of cars) {
      try {
        await createCar({
          brand: car.brand,
          model: car.model,
          body: "Кроссовер",
          priceFrom: car.priceFrom,
          priceTo: car.priceTo,
          description: "",
        });

        imported++;
      } catch (e) {
        console.error(e);
      }
    }

    alert(`Импорт завершён!\n\nДобавлено автомобилей: ${imported}`);
  };

  return (
    <label
      className="
      cursor-pointer
      rounded-xl
      bg-emerald-600
      px-5
      py-3
      text-white
      hover:bg-emerald-700
      "
    >
      📥 Импорт Excel

      <input
        type="file"
        accept=".xlsx"
        hidden
        onChange={handleImport}
      />
    </label>
  );
}