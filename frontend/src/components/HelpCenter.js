import React from 'react'
import Helpimg from "../../public/help.jpg"
import Image from 'next/image'

const HelpCenter = () => {
    return (
        <section>
            <div className="help_cont">
                <div className="hlep_main_cont flex items-center justify-center bg-black h-[55vh]">
                    <div className="content  h-[300px] w-[920px]  pl-40">
                        <div className="content text-white w-[350px] relative">
                            <h1 className="text-3xl font-bold">Need Help? Check Out Our Help Center</h1>
                            <p className="mt-8">I'm a paragraph. Click here to add your own text and edit me. Let your users get to know you.</p>
                        <button type="submit" className="hover:bg-violet-300  bg-white hover:text-black mt-8 text-violet-700 px-6 p-[13px] rounded-3xl transition hover:bg-black"
                        >
                           Got to Help Center
                        </button>
                        </div>
                    </div>
                    <div className="img_cont  h-full w-full bg-green-500 border-2 bg-gray-200 overflow-hidden Special-img">
                        <Image
                            src={Helpimg}
                            alt="Clipped Image"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HelpCenter



