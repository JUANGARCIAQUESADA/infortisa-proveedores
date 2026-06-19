"use client";

import { useState, useEffect } from "react";
import { Category } from "@/types";
import { Button } from "@/components/ui/Button";

interface FilterValues {
  categories: string[];
  minPrice: string;
  maxPrice: string;
  search: string;
}

interface ProductFiltersProps {
  categories: Category[];
  initialValues?: Partial<FilterValues>;
  onChange: (filters: FilterValues) => void;
}

export function ProductFilters({
  categories,
  initialValues = {},
  onChange,
}: ProductFiltersProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    initialValues.categories || []
  );
  const [minPrice, setMinPrice] = useState(initialValues.minPrice || "");
  const [maxPrice, setMaxPrice] = useState(initialValues.maxPrice || "");
  const [search, setSearch] = useState(initialValues.search || "");

  useEffect(() => {
    onChange({
      categories: selectedCategories,
      minPrice,
      maxPrice,
      search,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, minPrice, maxPrice, search]);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) =>
      prev.includes(slug)
        ? prev.filter((c) => c !== slug)
        : [...prev, slug]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSearch("");
  };

  const hasActiveFilters =
    selectedCategories.length > 0 || minPrice || maxPrice || search;

  return (
    <aside className="bg-white rounded-xl border border-gray-100 p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">Filtros</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Buscar
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nombre del producto..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
      </div>

      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Categorías
        </h3>
        <ul className="space-y-2">
          {categories.map((category) => (
            <li key={category.id}>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.slug)}
                  onChange={() => toggleCategory(category.slug)}
                  className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                  {category.name}
                </span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Precio (€)
        </h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="Mín."
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
          <span className="text-gray-400">—</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="Máx."
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          fullWidth
          size="sm"
          onClick={clearFilters}
        >
          Limpiar todos los filtros
        </Button>
      )}
    </aside>
  );
}

export default ProductFilters;
