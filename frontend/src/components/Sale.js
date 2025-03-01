"use client"
import Image from 'next/image'
import mobile from "../../public/mob.png"
import { Swiper, SwiperSlide} from "swiper/react";
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { Navigation} from 'swiper/modules';
import { useRef } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';

const products = [
  {
    name: 'JP - Space Tablet 10.4" Wi-Fi 32GB',
    price: 20,
    image: <Image src={mobile} className="h-60 w-full object-cover rounded-md" />,
  },
  {
    name: 'Ocean Pro 11 - 12.3" Touch Screen',
    price: 30,
    image: <Image src={mobile} className="h-60 w-full object-cover rounded-md" />,
  },
  {
    name: 'Shel 50" Class LED 4K UHD Smart TV',
    price: 25,
    image: <Image src={mobile} className="h-60 w-full object-cover rounded-md" />,
  },
  {
    name: 'Fitboot Inspire Fitness Tracker With Heart Rate Tracking',
    price: 40,
    image: <Image src={mobile} className="h-60 w-full object-cover rounded-md" />,
  },
  {
    name: 'Smartphone Z Pixel Max 128GB Unlocked',
    price: 35,
    image: <Image src={mobile} className="h-60 w-full object-cover rounded-md" />,
  },
  {
    name: '65" Class Nano LED 4K UHD Smart TV',
    price: 50,
    image: <Image src={mobile} className="h-60 w-full object-cover rounded-md" />,
  },
  {
    name: 'White Buds Wireless Earbud Headphones',
    price: 45,
    image: <Image src={mobile} className="h-60 w-full object-cover rounded-md" />,
  },
  {
    name: 'SDK Portable Bluetooth Speaker',
    price: 60,
    image: <Image src={mobile} className="h-60 w-full object-cover rounded-md" />,
  },
];

const Sale = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);


  return (
    <section>
      <div className="bg-white selling-cont mt-12  mx-auto">
        <div className="headingSelling text-center text-4xl font-semibold pt-14 pb-8">
          <h1>
        On Sale</h1>
        </div>
        <div className="flex justify-between items-center ">
        <button ref={prevRef} className="bg-gray-200  py-4 px-2 rounded relative top-[200px] z-10 right-[-30px]">
        <GrPrevious />
        </button>
        <button ref={nextRef} className="bg-gray-200  py-4 px-2 rounded relative top-[200px] z-10 left-[-30px]">
        <GrNext />
        </button>
      </div>
        <div className="px-20">
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
                <div className="p-4 shadow-md rounded-md text-center border-[1px]">
                  {product.image}
                  <div className="heading text-justify">
                  <h3 className="mt-4 text-lg font-semibold">{product.name}</h3>
                  <p className="text-gray-600 text-violet-700 mt-2">${product.price}</p>
                  </div>
                  <div className="bg-red-600 w-16 absolute top-3 rounded-full text-white py-[3px] z-20">
                    <h3 className="text-sm"><span>SALE</span></h3>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
          <div className="text-center py-[60px]">
           <button type="submit" className="bg-violet-700 text-white  w-[255px]  p-[10px] rounded-3xl transition hover:bg-black"
          >
            View All
          </button>
          </div>
      </div>
    </section>
  )
}

export default Sale