"use client";

import { useState } from "react";
import { Product } from "@/types";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/cart/CartContext";

interface AddToCartButtonProps {
  product: Product;
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Cantidad:</span>
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Reducir cantidad"
          >
            −
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={() =>
              setQuantity(Math.min(product.stock, quantity + 1))
            }
            className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
            disabled={quantity >= product.stock}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>
      </div>

      {/* Add to cart button */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={handleAdd}
        disabled={product.stock === 0}
      >
        {added ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
            ¡Añadido al carrito!
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            Añadir al carrito
          </>
        )}
      </Button>
    </div>
  );
}
