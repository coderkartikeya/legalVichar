'use client'

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SignIn } from '@clerk/clerk-react';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('lawyer');

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Welcome Text & Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-purple-900 to-blue-900 p-12 text-white items-center justify-center relative overflow-hidden">
        <div className="relative z-10 max-w-lg">
          <h1 className="font-serif text-4xl font-bold mb-6">Welcome Back to Smart Legal Assistant</h1>
          <p className="text-xl text-gray-200 mb-8">Manage your legal cases intelligently with AI.</p>
          {/* Legal-themed SVG illustration would go here */}
          <svg className="w-64 h-64 mx-auto opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        </div>
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-400 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-sm">
          <div className="text-center">
            <h2 className="font-serif text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          <SignIn forceRedirectUrl='/main'>

          </SignIn>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500 transition">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}