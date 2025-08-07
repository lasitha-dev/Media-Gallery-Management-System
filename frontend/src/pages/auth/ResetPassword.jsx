import React, { useState } from 'react';
import { Formik, Form, Field } from 'formik';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/auth/FormInput';
import Button from '../../components/auth/Button';
import { resetPasswordSchema } from '../../utils/validationSchemas';
import { resetPassword } from '../../services/authService';

const ResetPassword = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setError('');
      const response = await resetPassword({
        email: values.email,
        otp: values.otp,
        newPassword: values.newPassword
      });
      if (response.success) {
        navigate('/login', { 
          state: { message: 'Password reset successful. Please login with your new password.' }
        });
      }
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
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <Formik
          initialValues={{
            email: '',
            otp: '',
            newPassword: '',
            confirmPassword: ''
          }}
          validationSchema={resetPasswordSchema}
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

              <Field
                name="otp"
                type="text"
                label="OTP"
                component={FormInput}
                placeholder="Enter 6-digit OTP"
              />

              <Field
                name="newPassword"
                type="password"
                label="New Password"
                component={FormInput}
                autoComplete="new-password"
              />

              <Field
                name="confirmPassword"
                type="password"
                label="Confirm New Password"
                component={FormInput}
                autoComplete="new-password"
              />

              <Button type="submit" isLoading={isSubmitting}>
                Reset Password
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
