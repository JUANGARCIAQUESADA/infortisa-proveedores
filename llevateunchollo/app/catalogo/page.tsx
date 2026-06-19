"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { Product, Category } from "@/types";

interface FilterValues {
  categories: string[];
  minPrice: string;
  maxPrice: string;
  search: string;
}

export default function CatalogoPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const initialFilters: FilterValues = {
    categories: searchParams.get("categoria")
      ? [searchParams.get("categoria")!]
      : [],
    search: searchParams.get("buscar") || "",
    minPrice: searchParams.get("min_precio") || "",
    maxPrice: searchParams.get("max_precio") || "",
  };

  const [filters, setFilters] = useState<FilterValues>(initialFilters);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data: Category[]) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const fetchProducts = useCallback(async (f: FilterValues) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (f.categories.length > 0) {
        params.set("categoria", f.categories.join(","));
      }
      if (f.search) params.set("buscar", f.search);
      if (f.minPrice) params.set("min_precio", f.minPrice);
      if (f.maxPrice) params.set("max_precio", f.maxPrice);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(filters);
  }, [filters, fetchProducts]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo</h1>
        <p className="text-gray-500 mt-1">
          {loading
            ? "Cargando productos..."
            : `${products.length} ${products.length === 1 ? "producto encontrado" : "productos encontrados"}`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <ProductFilters
            categories={categories}
            initialValues={initialFilters}
            onChange={handleFilterChange}
          />
        </div>

        {/* Products */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-8 bg-gray-200 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid
              products={products}
              emptyMessage="No se encontraron productos con los filtros seleccionados"
            />
          )}
        </div>
      </div>
    </div>
  );
}
