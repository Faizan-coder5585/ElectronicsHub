// app/checkout/layout.js
import ProgressStepper from "./progress-stepper/page.js";

export default function CheckoutLayout({ children }) {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <ProgressStepper />
      <div className="mt-6">
        {children}
      </div>
    </div>
  );
}
