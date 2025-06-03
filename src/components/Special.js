import PriceImg from "../../public/dron.png"
import Image from 'next/image'



const Special = () => {
    return (
        <>
            {/* Special price Container */}
            <div className="bg-white special-cont mt-12 w-[1600px] mx-auto">
                <div className="flex ">
                    <div className="pl-10 price_container flex  flex-col">
                        <div className="cont-heade pt-20 mt-10">
                            <div className="price-sticker">
                                <p><span className="bg-red-600 text-white py-[2px] px-4 text-[18px]">Today's Special</span></p>
                            </div>
                            <div className="cont-head mt-4  md:text-3xl font-semibold">
                                <h1 className="mt-2">Best Arial View in Town</h1>
                                <p className="mt-4">
                                    <span className="text-8xl font-medium text-indigo-600">30%</span>
                                    <span className="text-8xl font-medium uppercase ">off</span>
                                </p>
                            <h2 className="mt-4 text-nowrap">on professional camera drones</h2>
                            <p className="mt-4 text-base">
                                   Limited quantities.<br></br>See product detail pages for availability.
                                </p>
                            </div>
                        </div>
                        <div className="btn_cont mt-8">
                        <button type="submit" className="bg-violet-700 text-white px-20 p-[10px] rounded-3xl transition hover:bg-black"
                        >
                            Shop
                        </button>
                        </div>
                    </div>
                    <div
                        className="w-full h-[70vh] bg-gray-200 overflow-hidden Special-img">
                        <Image
                            src={PriceImg}
                            alt="Clipped Image"
                            className="w-200 h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default Special