import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

function Register() {
  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Create an Account</h1>
        <p className="text-gray-600 mt-2">Sign up for a new account</p>
      </div>
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            required
          />
        </div>
        <Button className="w-full">Register</Button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/login" className="text-purple-600 hover:text-purple-700">
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default Register;