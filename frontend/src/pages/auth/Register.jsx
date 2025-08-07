import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import FormInput from '../../components/auth/FormInput';
import Button from '../../components/auth/Button';
import { registerSchema, otpSchema } from '../../utils/validationSchemas';
import { register, verifyOTP, resendOTP } from '../../services/authService';

const Register = () => {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const handleRegister = async (values, { setSubmitting }) => {
    try {
      setError('');
      const response = await register(values);
      setSuccessMessage(response.message);
      setRegisteredEmail(values.email);
      setShowOTPForm(true);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async (values, { setSubmitting }) => {
    try {
      setError('');
      const response = await verifyOTP({
        email: registeredEmail,
        otp: values.otp
      });
      setSuccessMessage(response.message);
      // Redirect to login after successful verification
      window.location.href = '/login';
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setError('');
      const response = await resendOTP(registeredEmail);
      setSuccessMessage(response.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          {showOTPForm ? 'Verify your email' : 'Create an account'}
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {successMessage && (
          <div className="rounded-md bg-green-50 p-4 mb-4">
            <div className="text-sm text-green-700">{successMessage}</div>
          </div>
        )}

        {showOTPForm ? (
          <Formik
            initialValues={{ otp: '' }}
            validationSchema={otpSchema}
            onSubmit={handleVerifyOTP}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <Field
                  name="otp"
                  type="text"
                  label="Enter OTP"
                  component={FormInput}
                  placeholder="Enter 6-digit OTP"
                />

                <Button type="submit" isLoading={isSubmitting}>
                  Verify OTP
                </Button>

                <div className="text-sm text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Resend OTP
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <Formik
            initialValues={{
              name: '',
              email: '',
              password: '',
              confirmPassword: ''
            }}
            validationSchema={registerSchema}
            onSubmit={handleRegister}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <Field
                  name="name"
                  type="text"
                  label="Full Name"
                  component={FormInput}
                  autoComplete="name"
                />

                <Field
                  name="email"
                  type="email"
                  label="Email address"
                  component={FormInput}
                  autoComplete="email"
                />

                <Field
                  name="password"
                  type="password"
                  label="Password"
                  component={FormInput}
                  autoComplete="new-password"
                />

                <Field
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password"
                  component={FormInput}
                  autoComplete="new-password"
                />

                <Button type="submit" isLoading={isSubmitting}>
                  Register
                </Button>

                <p className="mt-10 text-center text-sm text-gray-500">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                  >
                    Sign in
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

export default Register;
