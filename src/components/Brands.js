import React from 'react'

const Brands = () => {
  return (
   <>
   <section className="bg-white px-20 pb-20 mt-12 w-[1600px] mx-auto">
    <div className="brads_container">
     <div className="cont_brands">
     <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-semibold text-gray-800 py-16 ">Brands</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {/* Brand 1 */}
          <div className="flex items-center justify-center bg-white  h-[150px] border-[1px]">
            {/* <img src="/brand1.png" alt="Brand 1" className="h-[150px] object-contain" /> */}
          </div>
          {/* Brand 2 */}
          <div className="flex items-center justify-center bg-white  h-[150px] border-[1px]">
            {/* <img src="/brand2.png" alt="Brand 2" className="h-[150px] object-contain" /> */}
          </div>
          {/* Brand 3 */}
          <div className="flex items-center justify-center bg-white  h-[150px] border-[1px]">
            {/* <img src="/brand3.png" alt="Brand 3" className="h-[150px] object-contain" /> */}
          </div>
          {/* Brand 4 */}
          <div className="flex items-center justify-center bg-white  h-[150px] border-[1px]">
            {/* <img src="/brand4.png" alt="Brand 4" className="h-[150px] object-contain" /> */}
          </div>
          {/* Brand 5 */}
          <div className="flex items-center justify-center bg-white  h-[150px] border-[1px]">
            {/* <img src="/brand5.png" alt="Brand 5" className="h-[150px] object-contain" /> */}
          </div>
        </div>
      </div>
     </div>
    </div>
   </section>
   </>
  )
}

export default Brands