"use client"
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice.js";
import { GrNext, GrPrevious } from "react-icons/gr";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

// ✅ Helper function to truncate product names
const truncateName = (name) => {
  const words = name.split(" ");
  return words.length > 10 ? words.slice(0, 10).join(" ") + "..." : name;
};

const Sale = () => {
  const dispatch = useDispatch();
  const { products, productsStatus, productsError } = useSelector((state) => state.products);

  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  // ✅ Fetch products on mount
  useEffect(() => {
    if (productsStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [productsStatus, dispatch]);

  // ✅ Update Swiper navigation once component mounts
  useEffect(() => {
    if (swiperInstance && prevRef.current && nextRef.current) {
      swiperInstance.params.navigation.prevEl = prevRef.current;
      swiperInstance.params.navigation.nextEl = nextRef.current;
      swiperInstance.navigation.init();
      swiperInstance.navigation.update();
    }
  }, [swiperInstance]);

  // ✅ Handle loading, errors, and empty data
  if (productsStatus === "loading") {
    return <div className="text-center text-blue-500">Loading products...</div>;
  }

  if (productsStatus === "failed") {
    return <div className="text-center text-red-500">Error: {productsError}</div>;
  }

  if (!products || products.length === 0) {
    return <div className="text-center text-gray-600">No products found.</div>;
  }

  const limitedProducts = products.slice(0, 10);


  return (
    <section>
      <div className="bg-white selling-cont mt-12 mx-auto px-20">
        {/* Section Title */}
        <div className="headingSelling text-center text-4xl font-semibold pt-14 pb-8">
          <h1>On Sale</h1>
        </div>

        {/* Swiper Container with Navigation Buttons */}
        <div className="relative px-12">
          {/* Left Navigation Button */}
          <button
            ref={prevRef}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-3 rounded-full shadow-lg hover:bg-violet-700 z-10"
          >
            <GrPrevious size={20} />
          </button>

          <Swiper
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
            onSwiper={setSwiperInstance} // ✅ Save Swiper instance for navigation fix
            className="mySwiper"
          >
            {limitedProducts.map((product) => (
              <SwiperSlide key={product._id || product.id}>
                <Link href={`/products/${product._id || product.id}`} passHref>
                  <div className="relative p-4 bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden group transition-all duration-300 hover:shadow-xl hover:scale-105">
                    {/* Product Image */}
                    <div className="relative w-full h-60 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={product.images?.[0]?.url || "/fallback-image.png"}
                        alt={product.name || "Product Image"}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="bg-red-600 text-center w-16 absolute top-3 rounded-full text-white py-[3px] z-20">
                        <h3 className="text-sm"><span>SALE</span></h3>
                      </div>
                    </div>

                    {/* Discount Badge */}
                    {product.discountPercentage > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                        -{product.discountPercentage}%
                      </div>
                    )}

                    {/* Product Info */}
                    <div className="mt-4 px-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{product.brand} {truncateName(product.name)}</h3>
                      <p className="text-violet-700 font-medium mt-1">
                        ₹{new Intl.NumberFormat("en-IN").format(product.price)}
                      </p>

                      {/* Ratings */}
                      <div className="flex items-center space-x-1 mt-2">
                        {[...Array(5)].map((_, index) => (
                          <span key={index} className={`text-gray-900 ${index < product.rating ? "opacity-100" : "opacity-30"}`}>
                            ★
                          </span>
                        ))}
                      </div>

                      {/* Buttons */}
                      {/* <div className="flex justify-between items-center mt-4">
                      <button className="bg-violet-700 text-white text-sm px-4 py-2 rounded-md transition-all duration-300 hover:bg-black">
                        Add to Cart
                      </button>

                      <button className="border border-violet-700 text-violet-700 px-3 py-2 rounded-md text-sm transition-all duration-300 hover:bg-violet-700 hover:text-white">
                        Quick View
                      </button>
                    </div> */}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>

            ))}
          </Swiper>

          {/* Right Navigation Button */}
          <button
            ref={nextRef}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-300 p-3 rounded-full shadow-lg hover:bg-violet-700 z-10"
          >
            <GrNext size={20} />
          </button>
        </div>
        {/* View All Button */}
        <div className="text-center py-[60px]">
          <Link href="/products">
            <button
              type="button"
              className="bg-violet-700 text-white w-[255px] p-[10px] rounded-3xl transition hover:bg-black"
            >
              View All
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Sale
