"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice.js";
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { SlArrowRight } from "react-icons/sl";
import { useSearchParams, useRouter } from "next/navigation";


// Helper function to limit the name to 10 words
const truncateName = (name) => {
    const words = name.split(" ");
    return words.length > 10 ? words.slice(0, 10).join(" ") + "..." : name;
};

const Page = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();

    const { products, totalProducts, status } = useSelector((state) => state.products);

    const [isPriceFilterOpen, setIsPriceFilterOpen] = useState(false);
    const [price, setPrice] = useState(0);
    const [isColorFilterOpen, setIsColorFilterOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState("");
    const [hoveredColor, setHoveredColor] = useState(""); // State for hover tooltip
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    const [sortOption, setSortOption] = useState("Recommended");
    const [loadingMore, setLoadingMore] = useState(false);
    const [visibleCount, setVisibleCount] = useState(12); // Number of products to display at a time

    const category = searchParams.get("category") || "All Products";

    const categories = useMemo(() => [
        "All Products",
        "Computers",
        "Cameras",
        "Headphones",
        "Mobiles",
        "Sale",
        "Speakers",
        "Tablets",
        "TV and Cinema",
    ], []);

    const colors = useMemo(() => [
        { name: ": Blue", value: "blue", class: "bg-blue-500" },
        { name: ": Black", value: "black", class: "bg-black" },
    ], []);

    const sortOptions = useMemo(() => ({
        Recommended: "",
        "Price: Low to High": "price-asc",
        "Price: High to Low": "price-desc",
        "Newest Arrivals": "newest",
    }), []);

    // Fetch all products with applied filters
    const fetchFilteredProducts = useCallback(() => {
        dispatch(fetchProducts({
            category: category !== "All Products" ? category : undefined,
            color: selectedColor || undefined,
            sort: sortOptions[sortOption] || undefined,
            price: price ? `0-${price}` : undefined,
        }))
    }, [dispatch, category, selectedColor, sortOption, price]);

    useEffect(() => {
        fetchFilteredProducts();
    }, [fetchFilteredProducts]);

    const loadedProducts = useMemo(() => products.slice(0, visibleCount), [products, visibleCount]);

    const handleSort = (option) => {
        setSortOption(option);
        setIsSortDropdownOpen(false);
    };

    const handleColorSelect = (color) => {
        setSelectedColor(prev => prev === color ? "" : color);
    };
    // Load More Products
    const loadMoreProducts = () => {
        if (visibleCount >= totalProducts) return;
        setLoadingMore(true);
        setTimeout(() => {
            setVisibleCount((prev) => prev + 12);
            setLoadingMore(false);
        }, 500);
    };
     // Handle Category Selection with Active Highlight
     const handleCategoryOrProductClick = (selectedCategory, productId) => {
        const newParams = new URLSearchParams(searchParams);
    
        if (selectedCategory === "All Products") {
            newParams.delete("category"); // Remove category filter
        } else {
            newParams.set("category", selectedCategory);
        }
    
        router.push(`/products?${newParams.toString()}`, { scroll: false });
    
        // If a product ID is provided, navigate to the product details page
        if (productId) {
            router.push(`/products/${productId}`);
        }
    };
    
    return (
        <section>
            <div className="products_container h-auto">
                <div className="mini_cont_prod">
                    <div className="prod_top_menu_list-li flex gap-3 items-center pl-10 py-4">
                        <li className="text-black hover:text-blue-500 font-medium list-none text-base">
                            <Link href="/">Home</Link>
                        </li>
                        <SlArrowRight />
                        <li className="text-black hover:text-blue-500 font-medium list-none text-base">
                            <Link href="/products">All Products</Link>
                        </li>
                    </div>

                    <div className="prod_cate_items_controller flex">
                        {/* Sidebar Navigation */}
                        <div className="cate_side_cont w-[300px] pl-10 pt-4">
                            <nav className="space-y-2 list-none text-start pr-6">
                                <h1 className="text-2xl font-extralight">Browse by</h1>
                                <div className="w-50 border-b-[1px] border-gray-400 pt-4"></div>
                                {categories.map((item, index) => (
                                    <li
                                        key={index}
                                        className={`cursor-pointer text-base font-medium pt-2 transition-all duration-300 
                                            ${category === item ? "text-blue-700 font-semibold" : "text-black hover:text-blue-500"}`}
                                        onClick={() => handleCategoryClick(item)}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </nav>

                            {/* Filter by Price */}
                            <div className="filter_color_cont max-w-md mx-auto mt-10 pr-6">
                                <h1 className="text-2xl border-b-[1px] border-gray-400 py-4">Filter by</h1>

                                <div className="border-b-[1px] border-gray-400 py-4">
                                    <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsPriceFilterOpen(!isPriceFilterOpen)}>
                                        <span className="text-lg font-medium">Price</span>
                                        <span className="text-xl">{isPriceFilterOpen ? "-" : "+"}</span>
                                    </div>
                                    {isPriceFilterOpen && (
                                        <div className="mt-4 p-4 shadow rounded-lg border border-gray-200">
                                            <input
                                                type="range"
                                                min={100}
                                                max={250000}
                                                value={price}
                                                onChange={(e) => setPrice(Number(e.target.value))}
                                                className="w-full appearance-auto h-2 bg-gray-300 rounded-lg cursor-pointer"
                                            />
                                            <p className="text-center mt-2 text-gray-800 font-medium">
                                                Price: ₹{new Intl.NumberFormat("en-IN").format(price)}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {/* Filter by Color */}
                                <div className="border-b-[1px] border-gray-400 py-4">
                                    <div onClick={() => setIsColorFilterOpen(!isColorFilterOpen)} className="flex justify-between gap-2 items-center cursor-pointer">
                                        <span className={`text-lg font-medium ${hoveredColor ? "text-gray-800" : ""}`}>Colors {hoveredColor}</span>
                                        <span className="text-xl">{isColorFilterOpen ? "-" : "+"}</span>
                                    </div>
                                    {isColorFilterOpen && (
                                        <div className="grid grid-cols-4 mt-3">

                                            {colors.map((color, index) => (
                                                <div
                                                    key={index}
                                                    className={`${color.class} w-[25px] h-[25px] rounded-full shadow-md cursor-pointer ${selectedColor === color.value ? "ring-2 ring-blue-500" : ""
                                                        }`}
                                                    onClick={() => handleColorSelect(color.value)}
                                                    onMouseEnter={() => setHoveredColor(color.name)}
                                                    onMouseLeave={() => setHoveredColor("")}
                                                ></div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="Prod_list w-full pr-10">
                            <div className="text-start py-10">
                                <h1 className="font-semibold text-5xl">All Products</h1>
                            </div>
                            <div className="flex items-center justify-between py-4">
                                <h1 className="font-normal text-base">{products?.length || 0} Products</h1>
                                <div className="relative">
                                    <button onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)} className="text-black font-normal py-2 px-4 border border-gray-400 rounded-lg flex gap-2 items-center">
                                        <span>Sort by: {sortOption}</span>
                                        {isSortDropdownOpen ? <MdOutlineKeyboardArrowUp /> : <MdOutlineKeyboardArrowDown />}
                                    </button>
                                    {isSortDropdownOpen && (
                                        <ul className="absolute left-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                            {Object.keys(sortOptions).map((option, index) => (
                                                <li key={index} onClick={() => handleSort(option)} className="px-4 py-2 hover:bg-gray-200 cursor-pointer">
                                                    {option}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className="Prod_list w-full pr-10">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
                                    {/* Full-Screen Loading Spinner */}
                                    {status === "loading" && (
                                        <div className="fixed inset-0 flex justify-center items-center bg-white/40 z-50">
                                            <ClipLoader color="rgb(109 40 217)" size={60} />
                                        </div>
                                    )}
                                    {loadedProducts.length > 0 ? (
                                        loadedProducts.map((product) => (
                                            <div key={product._id}
                                            onClick={() => handleCategoryOrProductClick(category, product._id)} className="bg-white border border-gray-200 p-5 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
                                                <Image src={product.images?.[0]?.url || "/fallback-image.jpg"} alt={product.name} width={300} height={300} 
                                                className="object-cover rounded-lg"/>
                                                <h2>{truncateName(product.name)}</h2>
                                                <p className="mt-2 text-lg font-bold text-violet-700">
                                                    ₹{new Intl.NumberFormat("en-IN").format(product.price)}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-600">No products found.</p>
                                    )}

                                </div>

                                {visibleCount < totalProducts && (
                                    <div className="text-center mt-8">
                                        <button
                                            onClick={loadMoreProducts}
                                            disabled={loadingMore}
                                            className="bg-violet-700 text-white text-center py-2 px-6 rounded-lg shadow-md hover:bg-black transition  disabled:bg-gray-400"
                                        >
                                            {loadingMore ? (
                                                <>
                                                    <ClipLoader color="#FFFFFF" size={20} />
                                                </>
                                            ) : (
                                                "Load More"
                                            )}
                                        </button>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Page;