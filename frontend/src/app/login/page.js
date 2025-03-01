"use client";
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';  
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { LoginUser } from '../../redux/slices/authSlice.js';
import { LoginSchema } from '../../validation/authSchema.js';

const LoginPage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values) => {
    const result = await dispatch(LoginUser(values));
    if (LoginUser.fulfilled.match(result)) {
      router.push('/');  // Redirect to dashboard after successful login
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className="space-y-4">
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

            {error && (
              <div className="text-red-500 text-sm mb-4">
                {typeof error === 'string' ? error : error.message || 'Login failed, please try again.'}
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginPage;
