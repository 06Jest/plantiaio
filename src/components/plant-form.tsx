import {
  PLANT_CATEGORIES,
  PLANT_STATUSES,
  label,
  type PlantCategory,
  type PlantStatus,
} from "@/lib/plants";

type PlantValues = {
  name: string;
  species: string | null;
  category: PlantCategory;
  planted_on: string | null;
  description: string | null;
  status: PlantStatus;
};

type PlantFormProps = {
  action: (formData: FormData) => Promise<void>;
  plant?: PlantValues;
  submitLabel: string;
};

export function PlantForm({
  action,
  plant,
  submitLabel,
}: PlantFormProps) {
  return (
    <form
      action={action}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200 sm:p-8"
    >
      {/* Basic information */}
      <div>
        <h2 className="text-lg font-semibold text-stone-900">
          Plant information
        </h2>

        <p className="mt-1 text-sm text-stone-500">
          Add the basic details so you can keep track of your plant.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-stone-800"
          >
            Plant name
          </label>

          <input
            id="name"
            name="name"
            required
            maxLength={100}
            defaultValue={plant?.name ?? ""}
            placeholder="e.g. Balcony Basil"
            className="mt-1"
          />
        </div>

        <div>
          <label
            htmlFor="species"
            className="block text-sm font-medium text-stone-800"
          >
            Species or type
          </label>

          <input
            id="species"
            name="species"
            maxLength={150}
            defaultValue={plant?.species ?? ""}
            placeholder="e.g. Ocimum basilicum"
            className="mt-1"
          />
        </div>
      </div>

      {/* Plant details */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-stone-800"
          >
            Category
          </label>

          <select
            id="category"
            name="category"
            defaultValue={plant?.category ?? "other"}
            className="mt-1"
          >
            {PLANT_CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {label(item)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-stone-800"
          >
            Status
          </label>

          <select
            id="status"
            name="status"
            defaultValue={plant?.status ?? "growing"}
            className="mt-1"
          >
            {PLANT_STATUSES.map((item) => (
              <option key={item} value={item}>
                {label(item)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="planted_on"
            className="block text-sm font-medium text-stone-800"
          >
            Date planted
          </label>

          <input
            id="planted_on"
            name="planted_on"
            type="date"
            defaultValue={plant?.planted_on ?? ""}
            max={new Date().toISOString().split("T")[0]}
            className="mt-1"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-stone-800"
        >
          Description
        </label>

        <textarea
          id="description"
          name="description"
          maxLength={5000}
          defaultValue={plant?.description ?? ""}
          placeholder="Add notes about where it lives, its care routine, or anything else worth remembering..."
          className="mt-1 min-h-32 w-full rounded-lg border border-stone-300 p-3 outline-none transition placeholder:text-stone-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end border-t border-stone-100 pt-5">
        <button
          type="submit"
          className="w-full sm:w-auto"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}