import { uploadCarImage } from "../../services/storage";
import { useEffect, useState } from "react";

import Modal from "./Modal";
import CarForm from "./CarForm";
import ImportCars from "./ImportCars";
import DealerSelector from "./DealerSelector";

import {
  getCars,
  createCar,
  updateCar,
  deleteCar,
  CarFormData,
} from "../../services/cars";
import {
  getCarDealers,
  saveCarDealers,
} from "../../services/carDealers";

export default function CarList() {
  const [cars, setCars] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [editingCar, setEditingCar] = useState<any | null>(null);
const [dealerModalOpen, setDealerModalOpen] = useState(false);

const [dealerCarId, setDealerCarId] = useState<number | null>(null);

const [selectedDealers, setSelectedDealers] = useState<number[]>([]);

  async function uploadImage(id: number, file: File) {
    try {
      await uploadCarImage(id, file);

      await loadCars();

      alert("Фото загружено");
    } catch (e: any) {
      console.error(e);

      if (e?.message) {
        alert(e.message);
      } else {
        alert("Ошибка загрузки фото");
      }
    }
  }

  useEffect(() => {
    loadCars();
  }, []);

  async function loadCars() {
    try {
      const data = await getCars();
      setCars(data);
    } catch (e) {
      console.error(e);
      alert("Ошибка загрузки автомобилей");
    } finally {
      setLoading(false);
    }
  }

  async function saveCar(car: CarFormData) {
    try {
      if (editingCar) {
        await updateCar(editingCar.id, car);
      } else {
        await createCar(car);
      }

      setEditingCar(null);
      setOpen(false);

      await loadCars();
    } catch (e) {
      console.error(e);
      alert("Ошибка сохранения");
    }
  }

  async function removeCar(id: number) {
    if (!confirm("Удалить автомобиль?")) return;

    try {
      await deleteCar(id);

      await loadCars();
    } catch (e) {
      console.error(e);
      alert("Ошибка удаления");
    }
  }
async function openDealerSelector(carId: number) {
  try {
    const dealers = await getCarDealers(carId);

    setDealerCarId(carId);
    setSelectedDealers(dealers);

    setDealerModalOpen(true);
  } catch (e) {
    console.error(e);
    alert("Ошибка загрузки дилеров");
  }
}

async function saveDealers() {
  if (!dealerCarId) return;

  try {
    await saveCarDealers(
      dealerCarId,
      selectedDealers
    );

    alert("Дилеры сохранены");

    setDealerModalOpen(false);
  } catch (e) {
    console.error(e);
    alert("Ошибка сохранения");
  }
}
  return (
<>
  <div className="flex justify-between items-center mb-8">
    <h2 className="text-3xl font-bold">
      Автомобили
    </h2>

    <div className="flex gap-3">
      <ImportCars />

      <button
        onClick={() => {
          setEditingCar(null);
          setOpen(true);
        }}
        className="
          rounded-xl
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-5
          py-3
        "
      >
        + Добавить
      </button>
    </div>
  </div>

  {loading && (
    <div>Загрузка...</div>
  )}

  {!loading && cars.length === 0 && (
    <div
      className="
        rounded-2xl
        bg-white
        dark:bg-slate-900
        p-10
        text-center
      "
    >
      Пока автомобилей нет
    </div>
  )}

  <div className="space-y-4">
    {cars.map((car) => (
      <div
        key={car.id}
        className="
          rounded-2xl
          bg-white
          dark:bg-slate-900
          p-6
          flex
          justify-between
          items-center
        "
      >
        <div>
          <div className="text-xl font-bold">
            {car.brands?.name} {car.model}
          </div>

          <div className="text-slate-500 mt-2">
            {car.body}
          </div>

          <div className="mt-2 font-semibold">
            {car.price_from?.toLocaleString()} ₽
          </div>
        </div>

        <div className="flex gap-2">

          <label
            className="
              rounded-xl
              bg-sky-500
              hover:bg-sky-600
              text-white
              px-4
              py-2
              cursor-pointer
            "
          >
            📷

            <input
              hidden
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];

                if (!file) return;

                await uploadImage(car.id, file);
              }}
            />
          </label>

          <button
  onClick={() => openDealerSelector(car.id)}
  className="
    rounded-xl
    bg-emerald-500
    hover:bg-emerald-600
    text-white
    px-4
    py-2
  "
>
  🏢
</button>

          <button
            onClick={() => {
              setEditingCar({
                id: car.id,
                brand: car.brands?.name || "",
                model: car.model,
                body: car.body,
                price_from: car.price_from,
                price_to: car.price_to,
                description: car.description,
              });

              setOpen(true);
            }}
            className="
              rounded-xl
              bg-amber-500
              hover:bg-amber-600
              text-white
              px-4
              py-2
            "
          >
            ✏️
          </button>

          <button
            onClick={() => removeCar(car.id)}
            className="
              rounded-xl
              bg-red-500
              hover:bg-red-600
              text-white
              px-4
              py-2
            "
          >
            🗑️
          </button>

        </div>
      </div>
    ))}
  </div>
<Modal
  open={open}
  title={
    editingCar
      ? "Редактировать автомобиль"
      : "Добавить автомобиль"
  }
  onClose={() => {
    setEditingCar(null);
    setOpen(false);
  }}
>
  <CarForm
    car={editingCar}
    onSave={saveCar}
    onCancel={() => {
      setEditingCar(null);
      setOpen(false);
    }}
  />
</Modal>

<Modal
  open={dealerModalOpen}
  title="Дилеры автомобиля"
  onClose={() => setDealerModalOpen(false)}
>
  <DealerSelector
    selected={selectedDealers}
    onChange={setSelectedDealers}
  />

  <div className="flex justify-end mt-6 gap-3">

    <button
      onClick={() => setDealerModalOpen(false)}
      className="
        rounded-xl
        border
        px-5
        py-3
      "
    >
      Отмена
    </button>

    <button
      onClick={saveDealers}
      className="
        rounded-xl
        bg-blue-600
        text-white
        px-5
        py-3
      "
    >
      Сохранить
    </button>

  </div>

</Modal>

</>

);
}