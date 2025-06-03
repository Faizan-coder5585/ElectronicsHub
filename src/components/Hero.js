"use client"
import Image from "next/image"
import imgOne from "../../public/homeOne.jpg"
import imgTwo from "../../public/homeTwo.jpg"
import imgThree from "../../public/homeThree.jpg"
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';
import { Autoplay, EffectFade } from 'swiper/modules';
import { useRouter } from "next/navigation";


const Hero = () => {
    const router = useRouter();

  return (
    <>
      <div className="">
        <Swiper
          spaceBetween={20}
          slidesPerView={1}
          modules={[Autoplay, EffectFade]}
          effect={"fade"}
          autoplay={{
            delay: 6000,
            disableOnInteraction: true,
          }}
          loop={true}
          className="w-full mx-auto h-[75vh] z-0 py-100"
        >
          <SwiperSlide >
            <Image src={imgThree} className="object-cover w-full h-[610px]" />
          </SwiperSlide>
          <SwiperSlide >
            <Image src={imgTwo} className="object-cover w-full h-[610px]" />
          </SwiperSlide>
          <SwiperSlide >
            <Image src={imgOne} className="object-cover w-full h-[610px]" />
          </SwiperSlide>
          <div className="absolute top-20 pl-40 z-10">
            <div className="price-sticker">
              <p><span className="bg-red-600 text-white py-[2px] px-4">Best Prices</span></p>
            </div>
            <div className="cont-heade my-4 md:text-6xl font-semibold">
              <h1><span className="">Incredible Prices<br></br> on All Your<br></br>Favorite Items</span></h1>
            </div>
            <div className="cont-heade my-4">
              <p><span className="text-2xl">Get more for less on selected brands</span></p>
            </div>
            <button
              onClick={() => router.push("/checkout/address")} // <-- change path as needed
              className="bg-violet-700 text-white px-16 p-[10px] rounded-3xl transition hover:bg-black"
            >
              Shop Now
            </button>
          </div>
        </Swiper>
      </div>
    </>
  )
}

export default Hero