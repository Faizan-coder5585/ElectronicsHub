"use client";

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { RegisterUser } from '../../redux/slices/authSlice.js';
import { RegistrationSchema } from '../../validation/authSchema.js';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import OtpPage from '../otp/page.js'; // ✅ Make sure this path is correct


const RegisterPage = ({ onOtpSuccess }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpMessage, setOtpMessage] = useState('');
  const [showOtp, setShowOtp] = useState(false); // ✅
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleSubmit = async (values) => {
    const result = await dispatch(RegisterUser(values));
    if (RegisterUser.fulfilled.match(result)) {
      setRegisteredEmail(values.email);
      setOtpMessage('✅ An OTP has been sent to your email. Please verify to complete registration.');
      setShowOtp(true);
    }
  };
  
  const handleOtpSuccess = () => {
    console.log('OTP verified, navigating to checkout...');
    router.push('/otp');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-sm w-full bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
        {!showOtp ? (
          <>
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Create an Account</h2>
            <Formik
              initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
              validationSchema={RegistrationSchema}
              onSubmit={handleSubmit}
            >
              {() => (
                <Form className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">Full Name</label>
                    <Field
                      name="name"
                      type="text"
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter your full name"
                    />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">Email</label>
                    <Field
                      name="email"
                      type="email"
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
                    <div className="relative">
                      <Field
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Enter a strong password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-4 text-gray-500 hover:text-blue-600"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Confirm Password */}
                  <div className="relative">
                    <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700">Confirm Password</label>
                    <div className="relative">
                      <Field
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="Re-enter password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-4 text-gray-500 hover:text-blue-600"
                      >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  {/* Error message */}
                  {error && (
                    <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
                      {typeof error === 'string' ? error : error.message || 'Registration failed, please try again.'}
                    </div>
                  )}

                  {/* OTP message */}
                  {otpMessage && (
                    <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm text-center">
                      {otpMessage}
                    </div>
                  )}

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex items-center justify-center bg-violet-700 text-white py-2 rounded-lg font-semibold hover:bg-violet-800 transition duration-300 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                  >
                    {loading ? <ClipLoader color="#fff" size={22} /> : 'Register'}
                  </button>

                  <div className="text-center mt-4">
                    <p className="text-violet-600">Already have an account? <a href="/login" className="text-violet-700 hover:underline">Login</a></p>
                  </div>
                </Form>
              )}
            </Formik>
          </>
        ) : (
          <OtpPage  email={registeredEmail}  onSuccess={handleOtpSuccess}  />
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
