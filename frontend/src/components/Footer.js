import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import Image from "next/image"; 
import Visa from "../../public/Visa.png"
import MasterCard from "../../public/masterCard.png"
import American from "../../public/brand-amex@3x.png"
import Union from "../../public/union.png"
import JcbImg from "../../public/Jcb.png"
import Diners from "../../public/Diners.png"
import Discover from "../../public/Discover.png"
import PayPal from "../../public/PayPal.png"

export const Footer = () => {
  return (
    <>
     <secton>
      <footer className="bg-white  py-20">

      <div className="pl-40  mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="text-start">
          <h4 className="text-xl font-bold mb-6">Store Location</h4>
          <p className="mb-2">500 Terry Francine Street</p>
          <p className="mb-2">San Francisco, CA 94158</p>
          <p className="mb-2">info@mysite.com</p>
          <p>123-456-7890</p>

          
        <div className="text-start mt-8 ">
          <div className="flex gap-2 items-start">
            <a href="#" aria-label="Facebook">
              <FaFacebookF className="text-2xl hover:text-blue-500 transition duration-200" />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter className="text-2xl hover:text-blue-400 transition duration-200" />
            </a>
            <a href="#" aria-label="Instagram">
              <FaInstagram className="text-2xl hover:text-pink-500 transition duration-200" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <FaLinkedinIn className="text-2xl hover:text-blue-700 transition duration-200" />
            </a>
          </div>
            <h4 className="text-xl font-bold mt-4 px-2 text-start">Follow Us</h4>
        </div>

        </div>

        <div className="text-start">
          <h4 className="text-xl font-bold mb-6">
          Shop</h4>
          <p className="mb-2">Shop All</p>
          <p className="mb-2">Computers</p>
          <p className="mb-2">Tablets</p>
          <p className="mb-2">Drones & Cameras</p>
          <p className="mb-2">Audio</p>
          <p className="mb-2">Mobile</p>
          <p className="mb-2">T.V & Home Cinema</p>
          <p className="mb-2">Wearable Tech</p>
          <p className="mb-2">Sale</p>
          <p>Training</p>
        </div>

        <div className="text-start">
          <h4 className="text-xl font-bold mb-6">Customer Support</h4>
          <p className="mb-2">Contact Us</p>
          <p className="mb-2">Help Center</p>
          <p className="mb-2">About Us</p>
          <p className="mb-2">Careers</p>
          <p>Help Center</p>
        </div>
        
        <div className="text-start pl-4">
          <h4 className="text-xl font-bold mb-6">
          Policy</h4>
          <p className="mb-2">Shipping & Returns </p>
          <p className="mb-2">Terms & Conditions</p>
          <p className="mb-2">Payment Methods </p>
          <p>FAQ</p>
        </div>
      </div>
    </footer>
    <div className="payments_cont bg-white">
          <div className="w-full border-[1px] border-gray-200 h-[1px] w-[90%] mx-auto"></div>
           <div className="text-center pt-6">
            <h4>We accept the following paying methods</h4>
           </div>
          <div  className="flex items-center justify-center gap-12 py-12">
             <Image src={Visa} className="w-14 h-8"/>
             <Image src={MasterCard} className="w-14 h-8"/>
             <Image src={American} className="w-14 h-8"/>
             <Image src={Union} className="w-14 h-8"/>
             <Image src={JcbImg} className="w-14 h-8"/>
             <Image src={Diners} className="w-14 h-8"/>
             <Image src={Discover} className="w-14 h-8"/>
             <Image src={PayPal} className="w-14 h-8"/>
          </div >
        </div>
      
      <div className="flex items-center justify-center py-3">
        <p className="text-base">&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </div>
     </secton>
    </>
  )
}
