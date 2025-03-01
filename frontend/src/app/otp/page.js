"use client";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';  
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { VerifyOTP } from '../../redux/slices/authSlice.js';
import { OtpSchema } from '../../validation/authSchema.js';

const OtpPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (values) => {
    const result = await dispatch(VerifyOTP(values));
    if (VerifyOTP.fulfilled.match(result)) {
      setSuccessMessage('Your account has been successfully verified! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');  // Redirect to login after successful OTP verification
      }, 3000);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">OTP Verification</h2>
      <Formik
        initialValues={{ otp: '' }}
        validationSchema={OtpSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium">Enter OTP</label>
              <Field name="otp" type="text" className="mt-1 w-full p-2 border rounded-md" />
              <ErrorMessage name="otp" component="div" className="text-red-500 text-sm" />
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-4">
                {typeof error === 'string' ? error : error.message || 'Invalid OTP, please try again.'}
              </div>
            )}

            {successMessage && (
              <div className="text-green-500 text-sm mb-4 bg-green-100 p-2 rounded-md">
                {successMessage}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OtpPage;
