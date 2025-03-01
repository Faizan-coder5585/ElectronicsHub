import * as Yup from 'yup';

// Validation Schema for Registration
export const RegistrationSchema = Yup.object().shape({
  name: Yup.string().min(3, 'Name must be at least 3 characters').required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

// Validation Schema for OTP
export const OtpSchema = Yup.object().shape({
  otp: Yup.string().length(6, 'OTP must be exactly 6 digits').required('OTP is required'),
});


// Validation Schema for Login
export const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
})