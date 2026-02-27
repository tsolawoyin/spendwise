"use client";

interface AmountInputProps {
  value: string;
  onChange: (value: string) => void;
  color?: "emerald" | "red";
}

export default function AmountInput({
  value,
  onChange,
  color = "emerald",
}: AmountInputProps) {
  const textColor =
    color === "emerald" ? "text-emerald-500" : "text-red-500";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    // Allow only one decimal point
    const parts = raw.split(".");
    const sanitized =
      parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : raw;
    onChange(sanitized);
  };

  return (
    <input
      type="text"
      inputMode="decimal"
      placeholder="₦0"
      value={value ? `₦${value}` : ""}
      onChange={(e) => {
        const withoutSymbol = e.target.value.replace("₦", "");
        handleChange({ ...e, target: { ...e.target, value: withoutSymbol } });
      }}
      className={`w-full text-center text-5xl font-bold bg-transparent outline-none placeholder:text-slate-300 ${textColor}`}
    />
  );
}
