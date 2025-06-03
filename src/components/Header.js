"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { PiShippingContainer } from "react-icons/pi"
import { IoSearchSharp } from "react-icons/io5";
import { RiAccountCircleFill } from "react-icons/ri";
import { AiOutlineShoppingCart } from "react-icons/ai"
import { FiHeart } from "react-icons/fi";

const categories = [
    { name: "Mobiles", subcategories: ["Smartphones", "Feature Phones", "Accessories"] },
    { name: "Computers", subcategories: ["Laptops", "Desktops", "Monitors"] },
    { name: "Cameras", subcategories: ["DSLR", "Mirrorless", "Lenses"] },
    { name: "Headphones", subcategories: ["Wireless", "Wired", "Noise Cancelling"] },
    { name: "Earbuds", subcategories: ["TWS", "Wired", "Gaming Earbuds"] },
    { name: "Speakers", subcategories: ["Bluetooth", "Home Audio", "Portable"] },
    { name: "Tablets", subcategories: ["Android", "iPad", "Windows"] },
    { name: "TV and Cinema", subcategories: ["LED TV", "OLED TV", "Projectors"] },
    { name: "HomeTheater", subcategories: ["Soundbars", "AV Receivers", "Speakers"] },
    { name: "Laptop", subcategories: ["Gaming", "Ultrabooks", "2-in-1 Laptops"] },
];

export const Header = () => {

    const [activeCategory, setActiveCategory] = useState("");
    // Inside Header component:
    const user = useSelector((state) => state.auth.user);
    console.log("Logged in user:", user);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    return (
        <>
            <header>
                {/*Container-1 */}
                <section className="">
                    <div className="bg-black px-4 py-4 flex items-center justify-between">
                        <div className="">
                            <p className="text-white">
                                <sapn className="tracking-normal"> <PiShippingContainer className="inline-block mx-2 text-2xl" />Free Shipping for orders over $50</sapn>
                            </p>
                        </div>
                        <nav className="md:flex list-none text-nowrap gap-3">
                            <li className="text-white hover:text-blue-500 list-none text-base">
                                <Link href="/"> Home</Link>
                            </li>
                            <li className="text-white hover:text-blue-500 list-none text-base">
                                <Link href="/">About Us</Link>
                            </li>
                            <li className="text-white hover:text-blue-500 list-none text-base">
                                <Link href="/">Services</Link>
                            </li>
                            <li className="text-white hover:text-blue-500 list-none text-base">
                                <Link href="/">Help Center</Link>
                            </li>
                            <li className="text-white hover:text-blue-500 list-none text-base">
                                <Link href="/">Call Us<sapn className="tracking-normal underline"> : 123-456-7890</sapn></Link>
                            </li>
                        </nav>
                    </div>
                </section>
                {/* Container-2 */}
                <div className="px-12 flex items-center justify-between bg-white">
                    <div className=" py-4 flex items-center gap-16">
                        <div className="heading">
                            <p className="text-white">
                                <sapn className="tracking-normal text-black text-4xl font-semibold">ElectronicHub</sapn>
                            </p>
                        </div>
                        <div className="">
                            <form className="flex items-center w-[360px]">
                                <input
                                    type="text"
                                    className="flex-1 px-4 py-2 bg-gray-200 hover:border-black rounded-l-full border rounded-l-md focus:outline-none  focus:ring-zinc-950"
                                    placeholder="Search..."
                                />
                                <button
                                    type="submit"
                                    className="bg-violet-700 text-white px-7 p-[11px] rounded-r-full hover:bg-black transition rounded-r-3xl"
                                >
                                    <IoSearchSharp className="w-5 h-5" />
                                </button>
                            </form>
                        </div>
                    </div>
                    <div className="log-cont flex items-center gap-8">
                        <div className="btn flex">
                            <button type="button" className="text-center">
                                <RiAccountCircleFill className="inline-block mr-2 text-2xl" />
                                {user ? (
                                    <span className="text-gray-900 hover:text-blue-500">
                                        {user.name}
                                    </span>
                                ) : (
                                    <Link href="/login">
                                        <span className="hover:text-blue-500">Login</span>
                                    </Link>
                                )}
                            </button>
                        </div>
                        <div className="cart-cont">
                            <FiHeart className="inline-block mr-4 text-2xl" />
                            <AiOutlineShoppingCart className="inline-block mx-1 text-2xl" />
                        </div>
                    </div>
                </div>

                {/* Container-3 */}
                <div className="pl-10 py-2 relative">
                    <nav className="md:flex space-x-3 lg:space-x-6 list-none text-nowrap">
                        {/* "Shop All" button */}
                        <li className="text-base cursor-pointer text-black hover:text-blue-500 font-semibold">
                            <Link href="/products">Shop All</Link>
                        </li>

                        {/* Categories with Hover Dropdown */}
                        {categories.map((category, index) => (
                            <li
                                key={index}
                                className="relative cursor-pointer text-base text-black hover:text-blue-500"
                                onMouseEnter={() => setHoveredCategory(category.name)}
                                onMouseLeave={() => setHoveredCategory(null)}
                            >
                                <Link href="/products">{category.name}</Link>

                                {/* Dropdown for Subcategories */}
                                {hoveredCategory === category.name && (
                                    <ul className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-300">
                                        {category.subcategories.map((sub, subIndex) => (
                                            <li key={subIndex} className="px-4 py-2 hover:bg-gray-100">
                                                <Link href="/products">{sub}</Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </nav>
                </div>
            </header>
        </>
    )
}
