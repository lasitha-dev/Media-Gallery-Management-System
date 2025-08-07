import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { Link } from 'react-router-dom';
import FormInput from '../../components/auth/FormInput';
import Button from '../../components/auth/Button';
import { forgotPasswordSchema } from '../../utils/validationSchemas';
import { forgotPassword } from '../../services/authService';

const ForgotPassword = () => {
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      const response = await forgotPassword(values.email);
      setSuccessMessage(response.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your email address and we'll send you an OTP to reset your password.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {successMessage ? (
          <div className="text-center">
            <div className="rounded-md bg-green-50 p-4 mb-4">
              <div className="text-sm text-green-700">{successMessage}</div>
            </div>
            <Link
              to="/reset-password"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              Proceed to reset password
            </Link>
          </div>
        ) : (
          <Formik
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <Field
                  name="email"
                  type="email"
                  label="Email address"
                  component={FormInput}
                  autoComplete="email"
                />

                <Button type="submit" isLoading={isSubmitting}>
                  Send Reset OTP
                </Button>

                <p className="mt-10 text-center text-sm text-gray-500">
                  Remember your password?{' '}
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

export default ForgotPassword;
