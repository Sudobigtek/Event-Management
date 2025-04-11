import React from 'react';
import { Button } from '../components/ui/button';

const Login = () => {
  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="text-gray-600 mt-2">Sign in to your account</p>
      </div>
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>
        <Button className="w-full">Sign In</Button>
      </form>
    </div>
  );
};

export default Login;