"use client"
import React, { useState } from "react";
import Image from "next/image";
import mob from "../../../public/mob.png"
import mobile from "../../../public/mob.png"
import Link from "next/link";
import { FiHeart } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { Navigation } from 'swiper/modules';
import { useRef } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';


const products = [
    {
        name: 'JP - Space Tablet 10.4" Wi-Fi 32GB',
        price: 20,
        image: <Image src={mobile} className="h-65 w-full object-cover rounded-md" />,
    },
    {
        name: 'Ocean Pro 11 - 12.3" Touch Screen',
        price: 30,
        image: <Image src={mobile} className="h-65 w-full object-cover rounded-md" />,
    },
    {
        name: 'Shel 50" Class LED 4K UHD Smart TV',
        price: 25,
        image: <Image src={mobile} className="h-65 w-full object-cover rounded-md" />,
    },
    {
        name: 'Smartphone Z Pixel Max 128GB Unlocked',
        price: 40,
        image: <Image src={mobile} className="h-65 w-full object-cover rounded-md" />,
    },
    {
        name: 'Smartphone Z Pixel Max 128GB Unlocked',
        price: 35,
        image: <Image src={mobile} className="h-65 w-full object-cover rounded-md" />,
    },
    {
        name: '65" Class Nano LED 4K UHD Smart TV',
        price: 50,
        image: <Image src={mobile} className="h-65 w-full object-cover rounded-md" />,
    },
    {
        name: 'White Buds Wireless Earbud Headphones',
        price: 45,
        image: <Image src={mobile} className="h-65 w-full object-cover rounded-md" />,
    },
    {
        name: 'SDK Portable Bluetooth Speaker',
        price: 60,
        image: <Image src={mobile} className="h-65 w-full object-cover rounded-md" />,
    },
];


const page = () => {
    const [isProductInfoOpen, setProductInfoIsOpen] = useState(false);
    const [isReturnOpen, setReturnIsOpen] = useState(false);
    const [isShipingOpen, setShipIsOpen] = useState(false);

    const productInfo = () => {
        setReturnIsOpen(!isProductInfoOpen);
    };

    const returnInfo = () => {
        setShipIsOpen(!isReturnOpen);
    };

    const shippingInfo = () => {
        setProductInfoIsOpen(!isShipingOpen);
    };

    const prevRef = useRef(null);
    const nextRef = useRef(null);
    return (
        <>
            <section>
                <div className='prod_detail_cont'>
                    <div className='prod_cont_main'>
                        <div className="top_headings py-12  w-[840px] mx-auto">
                            <li className="text-black hover:text-blue-500 list-none text-base">
                                <Link href="/">Home / Shel 50" Class LED 4K UHD Smart TV</Link>
                            </li>
                        </div>
                        <div className="Main_controller_cont flex justify-center gap-6">

                            <div className='Prod_img_cont w-[500px]'>
                                <div className='img border-[1px] border-black bg-white'>
                                    <Image src={mob} className="object-cover" />
                                </div>
                                <div className="price_cont_paragraph px-4 py-12">
                                    <p className="">I'm a product description. This is a great place to "sell" your product and grab buyers' attention. Describe your product clearly and concisely. Use unique keywords. Write your own description instead of using manufacturers' copy.</p>
                                </div>

                            </div>

                            <div className="details_all_cont w-[320px]">
                                <div className="Prod_quantity">
                                    <div className="pro_detail_name_heading">
                                        <h1 className="text-3xl font-semibold"> Shel 50" Class LED 4K UHD Smart TV</h1>
                                        <p className="text-base font-sm py-2">SKU: 001</p>
                                    </div>
                                    <div className="flex flex-col items-start mt-4">
                                        <div className="text-lg font-semibold text-gray-800 py-4">
                                            $10.00
                                        </div>
                                        <h3 className="text-lg pb-2">Quantity</h3>
                                        <div className="flex items-center space-x-4">
                                            <button className="px-3 py-1 text-white bg-violet-700  hover:bg-black">-</button>
                                            <span className="text-lg  font-medium ">1</span>
                                            <button className="px-3 py-1 text-white bg-violet-700  hover:bg-black">+</button>
                                        </div>
                                    </div>

                                </div>
                                <div className="Prod_add_whist_butn_cont mt-8">
                                    <div className="flex flex-col items-start space-y-2">
                                        <div className="cart-cont flex items-center justify-start gap-4">
                                            <button type="submit" className="bg-violet-700 text-white px-[90px] p-[7px] rounded-3xl transition hover:bg-black"
                                            >
                                                Add to Cart
                                            </button>
                                            <div className="flex items-center justify-center cart_cont_in border-[1px] border-violet-700 rounded-full w-9 h-9">
                                                <FiHeart className="inline-block text-violet-700 text-lg" />
                                            </div>
                                        </div>

                                        <button type="submit" className=" w-full bg-black text-white  p-[7px] rounded-3xl transition hover:bg-gray-500 hover:text-black"
                                        >
                                            Buy Now
                                        </button>
                                    </div>

                                </div>
                                <div className="heading_detail pr-4 pt-8">

                                    {/* Product Info Filter */}
                                    <div className="flex flex-col items-center justify-between py-4">
                                        {/* Button to toggle filter */}
                                        <div onClick={() => setProductInfoIsOpen(!isProductInfoOpen)}
                                            className="w-full flex justify-between  gap-2 items-center cursor-pointer">
                                            <span className='text-lg font-medium'>Product Info</span>
                                            <span className="text-xl">{isProductInfoOpen ? "-" : "+"}</span>
                                        </div>

                                        {/* Collapsible Price Filter Box */}
                                        {isProductInfoOpen && (
                                            <div className="py-4">
                                                <p>I'm a product detail. I'm a great place to add more information about your product such as sizing, material, care and cleaning instructions. This is also a great space to write what makes this product special and how your customers can benefit from this item..</p>
                                            </div>
                                        )}
                                        <div></div>
                                    </div>
                                    {/* Product Return Info Filter */}
                                    <div className="flex flex-col items-center justify-between py-4">
                                        {/* Button to toggle filter */}
                                        <div onClick={() => setReturnIsOpen(!isReturnOpen)}
                                            className="w-full flex justify-between  gap-2 items-center cursor-pointer">
                                            <span className='text-lg font-medium'>Return & Refund Policy</span>
                                            <span className="text-xl">{isReturnOpen ? "-" : "+"}</span>
                                        </div>

                                        {/* Collapsible Price Filter Box */}
                                        {isReturnOpen && (
                                            <div className="py-4">
                                                <p>I’m a Return and Refund policy. I’m a great place to let your customers know what to do in case they are dissatisfied with their purchase. Having a straightforward refund or exchange policy is a great way to build trust and reassure your customers that they can buy with confidence.</p>
                                            </div>
                                        )}
                                        <div></div>
                                    </div>
                                    {/* Product Shipping Info Filter */}
                                    <div className="flex flex-col items-center justify-between py-4">
                                        {/* Button to toggle filter */}
                                        <div onClick={() => setShipIsOpen(!isShipingOpen)}
                                            className="w-full flex justify-between  gap-2 items-center cursor-pointer">
                                            <span className='text-lg font-medium'>Shipping Info</span>
                                            <span className="text-xl">{isShipingOpen ? "-" : "+"}</span>
                                        </div>

                                        {/* Collapsible Price Filter Box */}
                                        {isShipingOpen && (
                                            <div className="py-4">
                                                <p>I'm a shipping policy. I'm a great place to add more information about your shipping methods, packaging and cost. Providing straightforward information about your shipping policy is a great way to build trust and reassure your customers that they can buy from you with confidence.</p>
                                            </div>
                                        )}
                                        <div></div>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>
                </div>

                {/* You might also like */}
                <div className="selling-cont w-[1400px] mx-auto my-10">
                    <div className="headingSelling text-start text-4xl font-semibold py-10">
                        <h1>You might also like</h1>
                    </div>
                    <div className="">
                        <Swiper
                            // navigation={true}
                            modules={[Navigation]}
                            spaceBetween={10}
                            slidesPerGroup={1}
                            slidesPerView={5}
                            className="mySwiper"
                            navigation={{
                                prevEl: prevRef.current,
                                nextEl: nextRef.current,
                            }}
                            onBeforeInit={(swiper) => {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                            }}
                        >
                            {products.map((product, index) => (
                                <SwiperSlide key={index}>
                                    <div className="border-gray-400 text-center border-[1px]">
                                        <div className="relative group bg-white">
                                            {product.image}
                                            <button
                                                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 bg-black text-white px-4 py-2  opacity-0 group-hover:translate-y-1 group-hover:opacity-100 hover:bg-violet-700  transition-all duration-500 w-full"
                                            >
                                                Quick View
                                            </button>
                                        </div>
                                        <div className="heading text-justify bg-zinc-200 px-2 py-2">
                                            <h3 className="mt-4 text-sm font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                                                {product.name}
                                            </h3>
                                            <p className="text-gray-600 text-violet-700 mt-2">${product.price}</p>
                                        </div>
                                    </div>

                                </SwiperSlide>

                            ))}
                        </Swiper>
                    </div>
                    <div className="flex justify-between items-center ">
                        <button ref={prevRef} className="bg-black text-white  py-4 px-2 rounded relative  z-10  hover:bg-violet-700">
                            <GrPrevious />
                        </button>
                        <button ref={nextRef} className="bg-black text-white  py-4 px-2 rounded relative  z-10  hover:bg-violet-700">
                            <GrNext />
                        </button>
                    </div>
                </div>
            </section>
        </>
    )
}

export default page