import * as XLSX from "xlsx";

const workbook = XLSX.readFile("catalog.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const rows = XLSX.utils.sheet_to_json<(string | number | null)[]>(sheet, {
  header: 1,
});

type ParsedCar = {
  brand: string;
  model: string;
  priceFrom: number;
  priceTo: number;
};

const cars: ParsedCar[] = [];

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

for (let row = 2; row < rows.length; row++) {

  const current = rows[row];

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

console.log("");

console.log("Автомобилей найдено:", cars.length);

console.table(cars.slice(0, 20));