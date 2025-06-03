import { RiEBike2Line } from "react-icons/ri";
import { PiShippingContainer } from "react-icons/pi"
import { MdOutlinePriceChange } from "react-icons/md";
import { Ri24HoursLine } from "react-icons/ri";




const Services = () => {
    return (
        <>
            <section className="w-[1600px] mx-auto">
                <div className="services-cont flex items-center justify-around bg-white py-[70px]">
                    {/* Container-1 */}
                    <div className="cont-pickup flex items-center gap-6">
                        <RiEBike2Line className="text-4xl"/>
                        <div className="cont-heade font-semibold">
                            <p><span className="text-2xl text-black">Curb-side</span>
                            <br></br>
                          <span className="text-2xl text-black">pickup</span></p>
                        </div>
                    </div>
                    {/* Container-2 */}
                    <div className="cont-shipping flex items-center gap-6">
                        <PiShippingContainer className="text-4xl" />
                        <div className="cont-heade  font-semibold">
                            <p><span className="text-2xl text-black">
                                Free shipping on</span>
                            <br></br>
                           <span className="text-2xl text-black">orders over $50</span></p>
                        </div>
                    </div>
                    {/* Container-3 */}
                    <div className="cont-lowPrice flex items-center gap-6">
                        <MdOutlinePriceChange className="text-4xl"/>
                        <div className="cont-heade font-semibold">
                            <p><span className="text-2xl text-black">
                                Low prices</span>
                            <br></br>
                            <span className="text-2xl text-black">guaranteed</span></p>
                        </div>
                    </div>
                    {/* Container-4 */}
                    <div className="cont-serviceTime flex items-center gap-6">
                        <Ri24HoursLine className="text-4xl"/>
                        <div className="cont-heade font-semibold">
                            <p><span className="text-2xl text-black">
                                Available to</span>
                            <br></br>
                            <span className="text-2xl text-black">you 24/7</span></p>
                        </div>
                    </div>
                </div>

            </section>
        </>
    )
}

export default Services