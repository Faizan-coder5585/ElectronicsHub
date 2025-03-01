import Link from "next/link";
import { PiShippingContainer } from "react-icons/pi"
import { IoSearchSharp } from "react-icons/io5";
import { RiAccountCircleFill } from "react-icons/ri";
import { AiOutlineShoppingCart } from "react-icons/ai"
import { FiHeart } from "react-icons/fi";

const categories = [
    "Mobiles", "Computers", "Cameras", "Headphones", "Earbuds", "Speakers", "Tablets", "TV and Cinema", "HomeThreater", "Laptop"
];


export const Header = () => {

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
                            <button type="submit" className="text-center">
                                <RiAccountCircleFill className="inline-block mr-2 text-2xl" />
                                <Link href="/pages/authentication/register">
                                    <span className="hover:text-blue-500">Login</span>
                                </Link>
                            </button>
                        </div>
                        <div className="cart-cont">
                            <FiHeart className="inline-block mr-4 text-2xl" />
                            <AiOutlineShoppingCart className="inline-block mx-1 text-2xl" />
                        </div>
                    </div>
                </div>

                {/* Container-3 */}
                <div className="pl-10 py-2">
                    <nav className="md:flex space-x-3 lg:space-x-6 list-none text-nowrap">
                        <li className="text-black hover:text-blue-500 list-none text-base">
                            <Link  href={`/products`}>Shop All</Link>
                        </li>
                        {categories.map((category, index) => (
                            <div key={index} className="flex items-center justify-center flex-col gap-2">
                                <Link href={`/products?category=${encodeURIComponent(category)}`} className="text-black hover:text-blue-500 font-medium text-base">
                                    {category}
                                </Link>
                            </div>
                        ))}
                    </nav>
                </div>
            </header>
        </>
    )
}
