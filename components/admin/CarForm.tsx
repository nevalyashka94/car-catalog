import { useEffect, useState } from "react";

type Car = {
  id?: number;
  brand: string;
  model: string;
  body: string;
  price_from?: number;
  price_to?: number;
  priceFrom?: number;
  priceTo?: number;
  description: string;
};

type Props = {
  car?: Car | null;

  onSave: (car: {
    brand: string;
    model: string;
    body: string;
    priceFrom: number;
    priceTo: number;
    description: string;
  }) => void;

  onCancel: () => void;
};

export default function CarForm({
  car,
  onSave,
  onCancel,
}: Props) {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [body, setBody] = useState("");
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!car) return;

    setBrand(car.brand || "");

    setModel(car.model || "");

    setBody(car.body || "");

    setPriceFrom(
      String(car.priceFrom ?? car.price_from ?? "")
    );

    setPriceTo(
      String(car.priceTo ?? car.price_to ?? "")
    );

    setDescription(car.description || "");
  }, [car]);

  function save() {
    if (!brand || !model) {
      alert("Заполните бренд и модель");
      return;
    }

    onSave({
      brand,
      model,
      body,
      priceFrom: Number(priceFrom),
      priceTo: Number(priceTo),
      description,
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <label className="font-semibold">
          Бренд
        </label>

        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="mt-2 w-full rounded-xl border p-3"
        />
      </div>

      <div>
        <label className="font-semibold">
          Модель
        </label>

        <input
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="mt-2 w-full rounded-xl border p-3"
        />
      </div>

      <div>
        <label className="font-semibold">
          Кузов
        </label>

        <input
          value={body}
          onChange={(e) => setBody(e.target.value)}
          className="mt-2 w-full rounded-xl border p-3"
        />
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="font-semibold">
            Цена от
          </label>

          <input
            type="number"
            value={priceFrom}
            onChange={(e) => setPriceFrom(e.target.value)}
            className="mt-2 w-full rounded-xl border p-3"
          />
        </div>

        <div>
          <label className="font-semibold">
            Цена до
          </label>

          <input
            type="number"
            value={priceTo}
            onChange={(e) => setPriceTo(e.target.value)}
            className="mt-2 w-full rounded-xl border p-3"
          />
        </div>
      </div>

      <div>
        <label className="font-semibold">
          Описание
        </label>

        <textarea
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-2 w-full rounded-xl border p-3"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-xl border px-5 py-3"
        >
          Отмена
        </button>

        <button
          onClick={save}
          className="rounded-xl bg-blue-600 px-5 py-3 text-white"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}