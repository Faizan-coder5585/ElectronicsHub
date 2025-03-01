"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'
import mobile from "../../../public/mob.png";




const page = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'Product Name',
      price: 25.99,
      quantity: 1,
      image: <Image src={mobile} className="h-20 w-20 object-cover rounded-md" />,
    },
    {
      id: 2,
      name: 'Another Product',
      price: 15.49,
      quantity: 2,
      image: <Image src={mobile} className="h-20 w-20 object-cover rounded-md" />,
    },
    {
      id: 2,
      name: 'Another Product',
      price: 15.49,
      quantity: 2,
      image: <Image src={mobile} className="h-20 w-20 object-cover rounded-md" />,
    },
  ]);

  const updateQuantity = (id, increment = true) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: increment ? item.quantity + 1 : Math.max(item.quantity - 1, 1) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2);


  return (
    <>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>
        <div className="bg-white shadow rounded-lg p-4">
          {cartItems.length ? (
            <div>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-4 border-b border-gray-200"
                >
                  <div className="flex items-center space-x-4">
                    {item.image}
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => updateQuantity(item.id, false)}
                      className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, true)}
                      className="px-3 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-violet-700 hover:text-violet-900"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <div className="mt-4 text-right">
                <p className="text-lg font-semibold">Total: ${totalAmount}</p>
              </div>
              <div className="text-center py-[60px]">
                <Link href="/">
                  <button type="submit" className="bg-violet-700 text-white  w-[245px]  p-[7px] rounded-3xl transition hover:bg-black"
                  >
                    CheckOut
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default page