"use client"
import Image from "next/image"; 
import bannerOne from "../../public/bannerOne.jpg"
import bannerTwo from "../../public/bannerTwo.jpg"

const Banners = () => {
    return (
        <>
            <section className="">
                <div className="banner grid grid-cols-2 gap-10 px-12 mt-8 h-[60vh]">
                    <div className="first_Cont">
                        <Image src={bannerOne} className="w-full h-[55vh] object-cover]" />
                        <div className="banner-cont relative top-[-400] left-20">
                            <div className="cont-heade my-4 md:text-6xl font-semibold">
                                <h1><span className="text-2xl text-white">Holiday Deals</span></h1>
                            </div>
                            <div className="cont-heade my-4">
                                <p><span className="text-5xl font-bold text-white">Up to</span>
                                <br></br>
                                <span className="text-5xl font-bold text-white">30% off</span></p>
                            </div>
                            <div className="cont-heade my-4">
                                <p><span className="text-lg text-white">Selected Smartphone Brands</span></p>
                            </div>
                            <button type="submit" className="bg-white text-black py-2 px-14 rounded-3xl transition hover:bg-red-600"
                            >
                                Shop
                            </button>
                        </div>
                    </div>
                    {/* Container-2 */}
                    <div className="second_Cont">
                        <Image src={bannerTwo} className="w-full h-[55vh] object-cover" />
                        <div className="banner-cont relative top-[-400] left-20">
                        <div className="cont-heade my-4 md:text-6xl font-semibold ">
                                <h1><span className="text-2xl text-white">Just In</span></h1>
                            </div>
                            <div className="cont-heade my-4">
                                <p><span className="text-5xl font-bold text-white">Take Your </span>
                                <br></br>
                                <span className="text-5xl font-bold text-white">Sound</span>
                                <br></br>
                                <span className="text-5xl font-bold text-white">
                                Anywhere</span></p>
                            </div>
                            <div className="cont-heade my-4">
                                <p><span className="text-lg text-white">Top Headphone Brands</span></p>
                            </div>
                            <button type="submit" className="bg-white text-black p-2 px-14 rounded-3xl transition hover:bg-violet-900"
                            >
                                Shop
                            </button>
                        </div>
                    </div>
                    </div>
                    {/* Container-1 */}
            </ section >
        </>
    )
}

export default Banners