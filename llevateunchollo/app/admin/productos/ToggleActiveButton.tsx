"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ToggleActiveButtonProps {
  productId: string;
  active: boolean;
}

export default function ToggleActiveButton({
  productId,
  active: initialActive,
}: ToggleActiveButtonProps) {
  const [active, setActive] = useState(initialActive);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggle = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !active }),
      });
      if (res.ok) {
        setActive(!active);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none ${
        active ? "bg-green-500" : "bg-gray-300"
      } ${loading ? "opacity-50" : ""}`}
      aria-label={active ? "Desactivar producto" : "Activar producto"}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          active ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}
