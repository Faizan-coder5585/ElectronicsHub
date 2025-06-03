'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { LoginUser, setRedirectTo, clearRedirectTo } from '../../redux/slices/authSlice';
import { LoginSchema } from '../../validation/authSchema';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ClipLoader } from "react-spinners";

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { loading, error, redirectTo } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  // Check for redirect query param on mount
  useEffect(() => {
    const queryRedirect = searchParams.get('redirectTo');
    if (queryRedirect) {
      dispatch(setRedirectTo(queryRedirect));
    }
  }, [searchParams, dispatch]);

  const handleSubmit = async (values) => {
    const result = await dispatch(LoginUser(values));

    if (LoginUser.fulfilled.match(result)) {
      const redirectPath = redirectTo || '/';
      dispatch(clearRedirectTo());
      router.push(redirectPath);
    } else {
      const errorMessage =
        result?.payload?.message ||
        result?.payload ||
        result?.error?.message ||
        'Login failed';
      console.error('Login failed:', errorMessage);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-sm w-full bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Welcome Back</h2>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                  Email
                </label>
                <Field
                  name="email"
                  type="email"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {/* Password Field */}
              <div className="relative">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Enter your password"
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

              {/* Error Message */}
              {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded-lg text-sm text-center">
                  {typeof error === 'string' ? error : error.message || 'Login failed, please try again.'}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center bg-violet-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition duration-300 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? <ClipLoader color="#fff" size={22} /> : 'Login'}
              </button>

              {/* Forgot Password */}
              <div className="text-center mt-4">
                <a href="/forgot-password" className="text-violet-500 hover:underline">
                  Forgot Password?
                </a>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
