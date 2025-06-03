"use client";

import { usePathname } from "next/navigation";

const steps = [
  { label: "Address", path: "/checkout/address" },
  { label: "Summary", path: "/checkout/order-summary" },
  { label: "Payment", path: "/checkout/payment" },
];

export default function ProgressStepper() {
  const pathname = usePathname();
  const currentIndex = steps.findIndex((step) => pathname.startsWith(step.path));

  return (
    <div className="flex items-center justify-between mb-10">
      {steps.map((step, index) => (
        <div key={step.path} className="flex items-center gap-2 w-full">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
              index === currentIndex
                ? "bg-violet-700 text-white"
                : index < currentIndex
                ? "bg-green-600 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-full h-1 ${
                index < currentIndex ? "bg-green-600" : "bg-gray-300"
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
}
