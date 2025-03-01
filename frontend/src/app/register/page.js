"use client";

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';  
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { RegisterUser } from '../../redux/slices/authSlice.js';
import { RegistrationSchema } from '../../validation/authSchema.js';

const Page = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');

  const handleSubmit = async (values) => {
    const result = await dispatch(RegisterUser(values));
    if (RegisterUser.fulfilled.match(result)) {
      setOtpMessage('An OTP has been sent to your email. Please verify to complete registration.');
      setTimeout(() => {
        router.push('/otp');  // Redirect after showing OTP message
      }, 3000);  // Delay redirection to allow user to read OTP message
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={RegistrationSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Name</label>
              <Field name="name" type="text" className="mt-1 w-full p-2 border rounded-md" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <Field name="email" type="email" className="mt-1 w-full p-2 border rounded-md" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
            </div>
            
            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <Field 
                name="password" 
                type={showPassword ? 'text' : 'password'} 
                className="mt-1 w-full p-2 border rounded-md" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-2 top-9 text-sm text-blue-500"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
            </div>

            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
              <Field 
                name="confirmPassword" 
                type={showConfirmPassword ? 'text' : 'password'} 
                className="mt-1 w-full p-2 border rounded-md" 
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                className="absolute right-2 top-9 text-sm text-blue-500"
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
              <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm" />
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-4">
                {typeof error === 'string' ? error : error.message || 'An error occurred'}
              </div>
            )}

            {otpMessage && (
              <div className="text-green-500 text-sm mb-4 bg-green-100 p-2 rounded-md">
                {otpMessage}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Page;
