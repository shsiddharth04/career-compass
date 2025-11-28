import React from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  return (
    <div className="flex min-h-[80vh] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto h-12 w-12 bg-white/10 rounded-full flex items-center justify-center border border-white/5">
            <KeyRound className="h-6 w-6 text-blue-400" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-white">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
            Enter your email to receive reset instructions
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-slate-300">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full rounded-md border-0 py-1.5 text-white bg-white/5 shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pl-2"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-neutral-950 shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all"
            >
              Send Reset Link
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-slate-400">
          Remembered it?{' '}
          <Link to="/login" className="font-semibold leading-6 text-blue-400 hover:text-blue-300">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
};