"use client";

import { useState } from "react";

interface DistanceInputProps {
  onSubmit: (distanceFeet: number) => void;
  disabled?: boolean;
}

export function DistanceInput({ onSubmit, disabled }: DistanceInputProps) {
  const [feet, setFeet] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const n = parseFloat(feet);
    if (Number.isNaN(n) || n < 0) {
      setError("Enter a valid distance (e.g. 12)");
      return;
    }
    if (n > 500) {
      setError("Distance too large");
      return;
    }
    onSubmit(n);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <label htmlFor="distance-ft" className="block text-sm font-medium">
        Distance (ft)
      </label>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id="distance-ft"
          type="number"
          inputMode="decimal"
          min={0}
          max={500}
          step={0.5}
          value={feet}
          onChange={(e) => setFeet(e.target.value)}
          placeholder="e.g. 12"
          disabled={disabled}
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-base min-w-0"
        />
        <button
          type="submit"
          disabled={disabled}
          className="rounded-lg bg-neutral-900 text-white py-2 px-4 font-medium disabled:opacity-50 touch-manipulation sm:min-w-[120px]"
        >
          Calculate
        </button>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
