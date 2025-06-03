'use client';

import { useFormik } from 'formik';
import { addressValidationSchema } from '../../../validation/authSchema.js';
import { useDispatch, useSelector } from 'react-redux';
import { saveAddress } from '../../../redux/slices/addressSlice.js';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Address() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { address, status, error } = useSelector((state) => state.address);

  // ✅ Auto-redirect if address already exists in Redux state
 useEffect(() => {
  if (address && address._id) {
    router.push('/checkout/order-summary');
  }
}, [address, router]);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      street: '',
      nearby: '',
      city: '',
      district: '',
      state: '',
      pinCode: '',
      country: 'India',
    },
    validationSchema: addressValidationSchema,
    onSubmit: async (values) => {
      const result = await dispatch(saveAddress(values));
      console.log("🔍 Dispatch Result:", result);

      if (result.meta.requestStatus === 'fulfilled') {
        router.push('/checkout/order-summary');
      } else {
        console.error(result.payload?.message || 'Failed to save address');
      }
    },
  });

  useEffect(() => {
    if (status === 'failed' && error) {
      const msg = typeof error === 'string' ? error : error?.message || 'Failed to save address';
      alert(msg);
    }
  }, [status, error]);


  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">
      <h2 className="text-2xl font-semibold mb-4">Add New Address</h2>
      <form onSubmit={formik.handleSubmit} className="space-y-4" disabled={status === 'loading'}>
        {[
          { name: 'fullName', label: 'Full Name' },
          { name: 'street', label: 'Street Address' },
          { name: 'nearby', label: 'Nearby Landmark' },
          { name: 'city', label: 'City/Town' },
          { name: 'district', label: 'District' },
          { name: 'state', label: 'State' },
          { name: 'pinCode', label: 'PIN Code' },
          { name: 'country', label: 'Country' },
        ].map((field) => (
          <div key={field.name}>
            <label
              className="block font-medium mb-1 capitalize"
              htmlFor={field.name}
            >
              {field.label}
            </label>
            <input
              id={field.name}
              name={field.name}
              type="text"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values[field.name] || ''}
              className="w-full border border-gray-300 p-2 rounded"
              disabled={status === 'loading'}
            />
            {formik.touched[field.name] && formik.errors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{formik.errors[field.name]}</p>
            )}
          </div>
        ))}

        <button
          type="submit"
          disabled={status === 'loading'}
          className={`w-full py-2 px-4 rounded text-white ${
            status === 'loading' ? 'bg-gray-900 cursor-not-allowed' : 'bg-violet-700'
          }`}
        >
          {status === 'loading' ? 'Saving...' : 'Save Address'}
        </button>
      </form>
    </div>
  );
}
