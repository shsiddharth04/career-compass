import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Loader2, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      setIsLoading(true);
      setError('');
      try {
        await login(email, password);
        navigate('/dashboard');
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDemoLogin = () => {
      setEmail('demo@example.com');
      setPassword('password');
      setError('');
  }

  return (
    <div className="flex min-h-[80vh] flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="mx-auto h-12 w-12 bg-white/10 rounded-full flex items-center justify-center border border-white/5">
            <Lock className="h-6 w-6 text-blue-400" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-md text-sm text-center">
              <p className="font-medium">{error}</p>
              {error === 'Invalid email or password' && (
                  <div className="mt-2 text-xs text-slate-400">
                    <p>Tip: Try the demo account:</p>
                    <p className="font-mono mt-1 text-slate-300">demo@example.com / password</p>
                    <button 
                        type="button" 
                        onClick={handleDemoLogin} 
                        className="mt-2 inline-flex items-center text-blue-400 hover:text-blue-300 font-medium"
                    >
                        Auto-fill Demo Credentials <ArrowRight className="h-3 w-3 ml-1" />
                    </button>
                  </div>
              )}
            </div>
          )}
          
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-white bg-white/5 shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pl-2"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-slate-300">
                Password
              </label>
              <div className="text-sm">
                <Link to="/forgot" className="font-semibold text-blue-400 hover:text-blue-300">
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-white bg-white/5 shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-slate-500 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 pl-2"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-white px-3 py-1.5 text-sm font-semibold leading-6 text-neutral-950 shadow-sm hover:bg-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-70 disabled:cursor-not-allowed items-center gap-2 transition-all"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-slate-400">
          Not a member?{' '}
          <Link to="/signup" className="font-semibold leading-6 text-blue-400 hover:text-blue-300">
            Start a 14 day free trial
          </Link>
        </p>
      </div>
    </div>
  );
};