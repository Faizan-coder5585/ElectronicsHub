"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { GrNext, GrPrevious } from "react-icons/gr";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// Helper function to limit the name to 10 words
const truncateName = (name) => {
  if (!name) return ""; // ✅ Handle undefined or empty names
  const words = name.split(" ");
  return words.length > 10 ? words.slice(0, 10).join(" ") + "..." : name;
};

const Sellers = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null);
  const [swiperReady, setSwiperReady] = useState(false);

  // Fetch products when the component mounts
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts({})); // ✅ Fix: Ensure fetchProducts is dispatched with {}
    }
  }, [status, dispatch]);

  // Ensure Swiper navigation works after refs are set
  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
    setSwiperReady(true);
  }, []);

  if (status === "loading") {
    return <div className="text-center py-6">Loading...</div>;
  }

  if (status === "failed") {
    return <div className="text-center text-red-600 py-6">Error: {error}</div>;
  }

  const limitedProducts = Array.isArray(products) ? products.slice(0, 5) : [];


  return (
    <section>
      <div className="bg-white selling-cont mt-12 mx-auto">
        <div className="headingSelling text-center text-4xl font-semibold pt-14 pb-8">
          <h1>Best Sellers</h1>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center relative">
          <button
            ref={prevRef}
            className="bg-gray-200 py-3 px-3 rounded absolute left-0 top-1/2 transform -translate-y-1/2 z-10"
          >
            <GrPrevious />
          </button>
          <button
            ref={nextRef}
            className="bg-gray-200 py-3 px-3 rounded absolute right-0 top-1/2 transform -translate-y-1/2 z-10"
          >
            <GrNext />
          </button>
        </div>

        {/* Swiper Slider */}
        <div className="px-10">
          {swiperReady && (
            <Swiper
              ref={swiperRef}
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerGroup={1}
              slidesPerView={4}
              className="mySwiper"
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
            >
              {limitedProducts.map((product) => (
                <SwiperSlide key={product._id}> {/* ✅ Fixed: Use `_id` instead of `id` */}
                  <div className="p-4 shadow-md rounded-md text-center border relative">
                    <Image
                      src={product.images?.[0]?.url || "/fallback-image.png"} // ✅ Fixed: Fallback image
                      alt={product.name || "Product Image"}
                      width={300}
                      height={300}
                      priority
                      className="h-60 w-full object-cover rounded-md"
                    />
                    <div className="heading text-justify">
                      <h3 className="mt-2 text-base font-semibold">
                        {product.brand} {truncateName(product.name)}
                      </h3>
                      <p className="text-gray-600 text-violet-700 mt-2">
                        ₹{new Intl.NumberFormat("en-IN").format(product.price)}
                      </p>
                    </div>
                    <div className="bg-red-600 w-16 absolute top-3 left-3 rounded-full text-white py-[3px] z-20">
                      <h3 className="text-sm">SALE</h3>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center py-10">
          <Link href="/pages/products">
            <button
              type="button"
              className="bg-violet-700 text-white w-64 p-3 rounded-3xl transition hover:bg-black"
            >
              View All
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Sellers;
