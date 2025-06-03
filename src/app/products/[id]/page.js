"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../../redux/slices/productSlice";
import { placeOrder } from "../../../redux/slices/orderSlice";
import { FiHeart } from "react-icons/fi";
import { ClipLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setRedirectTo } from "../../../redux/slices/authSlice";

const Page = () => {
  const { id } = useParams();
  const productId = typeof id === "string" ? id : id?.[0];
  const router = useRouter();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [productInfoOpen, setProductInfoOpen] = useState(false);
  const [returnPolicyOpen, setReturnPolicyOpen] = useState(false);
  const [shippingInfoOpen, setShippingInfoOpen] = useState(false);

  const { product, productStatus, productError } = useSelector((state) => state.products);
  const { user, redirectTo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId]);


  // Auto-redirect if returning from register/login and redirectTo matches this product
  useEffect(() => {
    if (user?._id && redirectTo === `/products/${productId}`) {
      dispatch(setRedirectTo(null)); // Clear redirect
      router.push("/checkout/address");
    }
  }, [user, redirectTo, productId, dispatch, router]);

  const increaseQuantity = () => {
    if (quantity < (product?.stock || 0)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

 const handleBuyNow = async () => {
  if (!user?._id || !user?.email) {
    dispatch(setRedirectTo(`/products/${product._id}`));
    router.push("/register");
    return;
  }

  try {
    const result = await dispatch(
      placeOrder({
        products: [{ productId: product._id, quantity }],
        totalAmount: product.price * quantity, // ✅ Added this
      })
    ).unwrap();

    toast.success("Order placed successfully!", { autoClose: 2000 });
    router.push(`/checkout/address`);
  } catch (error) {
    console.error("Order placement failed:", error); // ✅ Add logging
    toast.error(`Order failed: ${error.message || error}`, { autoClose: 3000 });
  }
};


  if (productStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="rgb(109 40 217)" size={60} />
      </div>
    );
  }

  if (productStatus === "failed") {
    return <div className="text-center text-red-500">Error: {productError}</div>;
  }

  if (!product) {
    return <div className="text-center text-gray-600">Product not found.</div>;
  }

  return (
    <>
      <ToastContainer />
      <section>
        <div className="prod_detail_cont">
          <div className="prod_cont_main">
            <div className="top_headings py-12 w-[840px] mx-auto">
              <ul className="text-black text-base">
                <li>
                  <Link href="/">Home</Link> / {product.name}
                </li>
              </ul>
            </div>
            <div className="Main_controller_cont flex justify-center gap-6">
              {/* Product Image */}
              <div className="Prod_img_cont w-[500px]">
                <div className="img border bg-white">
                  <Image
                    src={product.images?.[0]?.url || "/fallback-image.jpg"}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="price_cont_paragraph px-4 py-12">
                  <p>{product.description}</p>
                </div>
              </div>

              {/* Product Info */}
              <div className="details_all_cont w-[320px]">
                <h1 className="text-3xl font-semibold">{product.name}</h1>
                <p className="text-sm py-2">SKU: {product._id}</p>
                <p className="text-lg font-semibold py-4">₹{product.price}</p>

                {product.stock > 0 ? (
                  <p className="text-green-600 font-semibold">
                    In Stock: {product.stock}
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold">Out of Stock</p>
                )}

                {/* Quantity */}
                {product.stock > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg pb-2">Quantity</h3>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={decreaseQuantity}
                        className="px-3 py-1 bg-violet-700 text-white hover:bg-black"
                      >
                        -
                      </button>
                      <span className="text-lg font-medium">{quantity}</span>
                      <button
                        onClick={increaseQuantity}
                        className="px-3 py-1 bg-violet-700 text-white hover:bg-black"
                      >
                        +
                      </button>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-8 space-y-2">
                  <button
                    onClick={handleBuyNow}
                    disabled={product.stock === 0}
                    className={`w-full p-[7px] rounded-3xl transition ${product.stock === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-700"
                      }`}
                  >
                    Buy Now
                  </button>
                  <div className="border border-violet-700 rounded-full w-9 h-9 flex items-center justify-center">
                    <FiHeart className="text-violet-700" />
                  </div>
                </div>

                {/* Expandable Info Sections */}
                {[{
                  title: "Product Info",
                  content: product.description,
                  open: productInfoOpen,
                  toggle: () => setProductInfoOpen(!productInfoOpen),
                },
                {
                  title: "Return & Refund Policy",
                  content: "30-day return policy available.",
                  open: returnPolicyOpen,
                  toggle: () => setReturnPolicyOpen(!returnPolicyOpen),
                },
                {
                  title: "Shipping Info",
                  content: "Free shipping on orders over ₹5000.",
                  open: shippingInfoOpen,
                  toggle: () => setShippingInfoOpen(!shippingInfoOpen),
                }].map(({ title, content, open, toggle }, index) => (
                  <div key={index} className="py-4">
                    <div
                      onClick={toggle}
                      className="flex justify-between items-center cursor-pointer"
                    >
                      <span className="text-lg font-medium">{title}</span>
                      <span className="text-xl">{open ? "-" : "+"}</span>
                    </div>
                    {open && <p className="py-2">{content}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
