'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { OtpSchema } from '../../validation/authSchema.js';
import {
  VerifyOTP,
  setRedirectTo,
  clearRedirectTo,
} from '../../redux/slices/authSlice.js';

const OtpPage = ({ email: propEmail, onSuccess }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const { loading, error, redirectTo, email: emailFromRedux } = useSelector((state) => state.auth);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const queryEmail = searchParams?.get('email');
    const localEmail = localStorage.getItem('email');

    const finalEmail = propEmail || queryEmail || localEmail || emailFromRedux;

    if (finalEmail) {
      setEmail(finalEmail);
      localStorage.setItem('email', finalEmail);
    } else {
      setErrorMessage('Missing email. Please register again.');
    }

    const queryRedirect = searchParams?.get('redirectTo');
    const storedRedirect = localStorage.getItem('redirectTo');

    if (queryRedirect) {
      dispatch(setRedirectTo(queryRedirect));
    } else if (storedRedirect && !redirectTo) {
      dispatch(setRedirectTo(storedRedirect));
    }
  }, [propEmail, dispatch, searchParams, redirectTo, emailFromRedux]);

  const handleSubmit = async (values) => {
    try {
      if (!email) {
        setErrorMessage('Email not found. Please try again.');
        return;
      }

      const result = await dispatch(VerifyOTP({ email, otp: values.otp }));
      console.log('OTP Dispatch Result:', result);

      if (VerifyOTP.fulfilled.match(result)) {
        const verifiedUser = result.payload?.user;

        setSuccessMessage('✅ OTP verified successfully.');
        setErrorMessage('');

        setTimeout(() => {
          dispatch(clearRedirectTo());
          localStorage.removeItem('redirectTo');
          localStorage.removeItem('email');

          if (verifiedUser?.verified && redirectTo) {
            router.push(redirectTo);
          } else {
            router.push('/');
          }

        }, 800);
        ;
      } else {
        setErrorMessage(result?.payload?.message || 'Invalid OTP. Please try again.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Something went wrong.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-40 p-6 bg-white rounded-2xl shadow-md">
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
              <ErrorMessage name="otp" component="span" className="text-red-500 text-sm" />
            </div>

            {(error || errorMessage) && (
              <div className="text-red-500 text-sm mb-4">
                {errorMessage || (typeof error === 'string' ? error : error.message)}
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
              className="w-full bg-violet-700 text-white py-2 rounded-md hover:bg-gray-900"
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
