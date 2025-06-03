"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  createRazorpayOrder,
  verifyPayment,
  resetPayment,
  fetchOrder,
} from "../../../redux/slices/paymentSlice";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const {
    orderCreation: { loading, error: orderError },
    verification: {
      loading: verifying,
      paymentInfo,
      orderStatus,
      error: paymentError,
    },
    status,
  } = useSelector((state) => state.payment);

  const [latestOrderId, setLatestOrderId] = useState(null);

  useEffect(() => {
    dispatch(resetPayment());

    try {
      const storedOrder = localStorage.getItem("latestOrder");
      const parsedOrder = storedOrder ? JSON.parse(storedOrder) : null;

      if (!parsedOrder || !parsedOrder._id) {
        alert("No valid order found. Please place an order first.");
        router.push("/checkout/address");
        return;
      }

      setLatestOrderId(parsedOrder._id);
    } catch (err) {
      console.error("Error parsing order from localStorage:", err);
      alert("Invalid order data. Please try again.");
      router.push("/checkout/address");
    }
  }, [dispatch, router]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!latestOrderId) return;

    try {
      const res = await dispatch(
        createRazorpayOrder({ orderId: latestOrderId })
      ).unwrap();

      const options = {
        key: res.key,
        amount: res.amount,
        currency: res.currency,
        order_id: res.order_id,
        name: "Your Company",
        description: "Order Payment",
        handler: async (response) => {
          try {
            const verifyRes = await dispatch(
              verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: latestOrderId,
                amount: res.amount,
              })
            ).unwrap();

            if (verifyRes.success) {
              const updatedOrder = await dispatch(fetchOrder(latestOrderId)).unwrap();

              if (updatedOrder) {
                localStorage.setItem("latestOrder", JSON.stringify(updatedOrder));
              }

              alert("✅ Payment Successful!");
              router.push("//orders/${orderId}");
            } else {
              alert("❌ Payment verification failed.");
            }
          } catch (err) {
            console.error("❌ Payment verification error:", err);
            alert("Payment verification failed.");
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#8b5cf6",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("❌ Razorpay order creation failed:", err);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-semibold mb-6">Payment</h2>

      {(orderError || paymentError) && (
        <p className="text-red-600 mb-4">{orderError || paymentError}</p>
      )}

      <button
        disabled={loading || verifying || status === "pending" || status === "verifying"}
        onClick={handlePayment}
        className="bg-violet-700 text-white px-6 py-3 rounded w-full"
      >
        {loading || verifying || status === "pending" || status === "verifying"
          ? "Processing..."
          : "Pay Now"}
      </button>

      {status === "success" && paymentInfo && (
        <div className="mt-6 text-green-700 space-y-1">
          <p>Payment ID: {paymentInfo?.razorpayPaymentId}</p>
          <p>Payment Status: {paymentInfo?.status}</p>
          <p>Order Status: {orderStatus}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
