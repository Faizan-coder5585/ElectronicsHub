"use client"
import Image from 'next/image'
import Link from 'next/link'
import mobile from "../../public/homeCategory/mobile.png"
import camera from "../../public/homeCategory/camera.png"
import homethreater from "../../public/homeCategory/homethreater.png"
import laptop from "../../public/homeCategory/laptop.png"
import speaker from "../../public/homeCategory/miniSpeaker.png"
import moniter from "../../public/homeCategory/moniter.png"
import tablet from "../../public/homeCategory/tablet.png"
import tv from "../../public/homeCategory/tv.png"
import earbuds from "../../public/homeCategory/earbuds.png"
import headphone from "../../public/homeCategory/headphone.png"
import PriceImg from "../../public/saveUpTo.png"

const CategoryProducts = [
    { imageSrc: mobile, alt: "Mobiles", category: "Mobiles" },
    { imageSrc: camera, alt: "Camera", category: "Cameras" },
    { imageSrc: homethreater, alt: "HomeThreater", category: "HomeThreater" },
    { imageSrc: tablet, alt: "Tablet", category: "Tablets" },
    { imageSrc: laptop, alt: "Laptop", category: "Laptop" },
    { imageSrc: speaker, alt: "Speaker", category: "Speakers" },
    { imageSrc: moniter, alt: "Moniter", category: "Computers" },
    { imageSrc: headphone, alt: "Headphone", category: "Headphones" },
    { imageSrc: tv, alt: "TV", category: "TV and Cinema" },
    { imageSrc: earbuds, alt: "Earbuds", category: "Earbuds" },
];

const categories = [
    "Mobiles", "Computers", "Cameras", "Headphones", "Earbuds", "Speakers", "Tablets", "TV and Cinema", "HomeThreater", "Laptop"
];

const Category = () => {
    return (
        <section>
            <div className="bg-white selling-cont mt-12">
                <div>
                    <div className="headingSelling text-center text-4xl font-semibold pt-14 pb-8">
                        <h1>Shop by Category</h1>
                    </div>
                    <div className="product-cont grid grid-cols-5 gap-2  auto-rows-fr mx-auto">
                        {categories.map((category, index) => (
                            <div key={index} className="flex items-center justify-center flex-col gap-2">
                                <div className="group relative w-60 h-60 overflow-hidden rounded-full items-center bg-zinc-200">
                                    {/* Filter products by category */}
                                    {CategoryProducts.filter(product => product.category === category || category === "All Products").map((product, index) => (
                                        <div key={index} className="flex items-center justify-center flex-col gap-2">
                                            <Link href={`/products?category=${encodeURIComponent(category)}`} className="group relative w-60 h-60 overflow-hidden rounded-full items-center bg-zinc-200 flex justify-center">
                                                {product && (
                                                    <Image
                                                        src={product.imageSrc}
                                                        alt={product.alt}
                                                        className="transition-transform scale-100 duration-[1500ms] group-hover:scale-110 w-40 h-40 object-cover"
                                                    />
                                                )}
                                            </Link>
                                        </div>
                                    ))}
                                </div>
                                <Link href={`/products?category=${encodeURIComponent(category)}`} className="text-black hover:text-blue-500 font-medium text-base pt-2">
                                    {category}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Save Price Container */}
                <div className="SavePriceConatiner pt-[105px]">
                    <div className="flex mx-auto">
                        <div className="w-[1150px] h-[70vh] bg-gray-200 overflow-hidden price-img">
                            <Image
                                src={PriceImg}
                                alt="Clipped Image"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="pl-20 price_container flex items-start justify-center flex-col">
                            <div className="cont-heade my-4">
                                <h1 className="md:text-3xl font-semibold">
                                    <span>Save up to</span>
                                </h1>
                                <h3 className="md:text-8xl font-semibold mt-4">
                                    <span>$150</span>
                                </h3>
                            </div>
                            <div className="cont-heade my-2">
                                <p><span className="text-3xl font-semibold text-nowrap">on selected laptop</span></p>
                                <p><span className="text-3xl font-semibold text-nowrap">& tablets brands</span></p>
                                <p><span className="text-base font-semibold text-nowrap">Terms and conditions apply</span></p>
                            </div>
                            <button type="submit" className="bg-violet-700 mt-4 text-white px-16 p-[10px] rounded-3xl transition hover:bg-black">
                                Shop
                            </button>
                        </div>
                        <div className="flex justify-center items-center price_logo bg-red-600 rounded-full w-[150px] h-[150px] text-center relative right-[540px] top-10">
                            <h1 className="text-white text-3xl font-semibold rotate-[25deg]">Best <br /> Price</h1>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Category;
