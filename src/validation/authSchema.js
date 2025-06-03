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


// Validation Schema for Address
export const addressValidationSchema = Yup.object().shape({
  fullName: Yup.string().required("Full Name is required"),
  street: Yup.string().required("Street Address is required"),
  nearby: Yup.string(),
  city: Yup.string().required("City/Town is required"),
  district: Yup.string().required("District is required"),
  state: Yup.string().required("State is required"),
  pinCode: Yup.string()
    .matches(/^[0-9]{6}$/, "PIN Code must be a 6-digit number")
    .required("PIN Code is required"),
  country: Yup.string().required("Country is required"),
});