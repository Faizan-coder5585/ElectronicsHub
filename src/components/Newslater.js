import React from 'react'

const Newslater = () => {
    return (
        <>
            <section>
                <div className="flex flex-col justify-center items-center mx-auto py-12  mt-8 w-[1600px] bg-violet-700">
                    <h2 className="text-3xl font-bold text-white mb-4">Newsletter</h2>
                    <p className="text-white mb-6 text-base">
                    Sign up to receive updates on new arrivals and special offers.
                    </p>

                    <form action="/" method="POST" className="space-y-2">
                            <label for="email" className="block text-base font-medium text-white">Email *</label>
                            <div className="flex gap-4 ">
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="w-[500px] mt-1 px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                                placeholder=""
                            />
                             <button
                            type="submit"
                            className="w-[200px] bg-black text-white font-semibold py-2 px-4 rounded-full shadow hover:text-black hover:bg-violet-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Subscribe
                        </button>
                        </div>

                        <div className="flex items-start pt-4">
                            <div className="pt-[3px]">
                            <input
                                id="accept"
                                name="accept"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-black border-white rounded focus:ring-blue-500 pt-2"
                            />
                            </div>
                            <label for="accept" className="ml-2 text-base text-white">
                            Yes, subscribe me to your newsletter.
                            </label>
                        </div>
                    </form>
                </div>
            </section>
        </>
    )
}

export default Newslater