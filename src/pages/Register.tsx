import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { BookOpen, Eye, EyeOff, User, GraduationCap, CheckCircle, ArrowRight, Zap, Trophy, Globe } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'instructor',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const success = await register(formData.name, formData.email, formData.password, formData.role);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    {
      icon: <Zap className="h-6 w-6 text-primary-600" />,
      title: 'Instant Access',
      description: 'Start learning immediately after signup'
    },
    {
      icon: <Trophy className="h-6 w-6 text-primary-600" />,
      title: 'Certificates',
      description: 'Earn recognized certificates'
    },
    {
      icon: <Globe className="h-6 w-6 text-primary-600" />,
      title: 'Global Network',
      description: 'Connect with learners worldwide'
    }
  ];

  const features = [
    'Access to 200+ premium courses',
    'Expert instructor guidance',
    'Progress tracking & analytics',
    'Mobile & offline learning',
    'Community forums & discussions',
    'Career guidance & support'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex">
      {/* Left Side - Branding & Benefits */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-600 via-primary-700 to-primary-600"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        <div className="relative w-full flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-12">
              <div className="relative">
                <BookOpen className="h-12 w-12 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
              <div>
                <span className="text-3xl font-bold">SkillSet</span>
                <div className="text-sm opacity-90 -mt-1">Learn. Master. Excel.</div>
              </div>
            </div>

            {/* Headline */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold leading-tight mb-4">
                Start Your Learning Adventure Today
              </h1>
              <p className="text-xl opacity-90 leading-relaxed">
                Join thousands of professionals who are transforming their careers with specialized skills.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-6 mb-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    {benefit.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{benefit.title}</h3>
                    <p className="opacity-90">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg mb-4">What's included:</h3>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />
                  <span className="opacity-90">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="relative">
              <BookOpen className="h-10 w-10 text-primary-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"></div>
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                SkillSet
              </span>
              <div className="text-xs text-gray-500 -mt-1">Learn. Master. Excel.</div>
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-primary-600 hover:text-primary-700 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white/80 backdrop-blur-sm"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white/80 backdrop-blur-sm"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white/80 backdrop-blur-sm"
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-primary-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors bg-white/80 backdrop-blur-sm"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-primary-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Account Type Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                I want to join as:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative flex cursor-pointer rounded-xl border-2 p-6 focus:outline-none transition-all ${
                  formData.role === 'student' 
                    ? 'border-primary-600 bg-primary-50 shadow-lg' 
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={formData.role === 'student'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center text-center w-full">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                      formData.role === 'student' ? 'bg-primary-100' : 'bg-gray-100'
                    }`}>
                      <User className={`h-6 w-6 ${formData.role === 'student' ? 'text-primary-600' : 'text-gray-600'}`} />
                    </div>
                    <span className={`font-semibold ${formData.role === 'student' ? 'text-primary-900' : 'text-gray-900'}`}>
                      Student
                    </span>
                    <span className={`text-sm mt-1 ${formData.role === 'student' ? 'text-primary-700' : 'text-gray-500'}`}>
                      Learn new skills
                    </span>
                  </div>
                </label>
                
                <label className={`relative flex cursor-pointer rounded-xl border-2 p-6 focus:outline-none transition-all ${
                  formData.role === 'instructor' 
                    ? 'border-primary-600 bg-primary-50 shadow-lg' 
                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="role"
                    value="instructor"
                    checked={formData.role === 'instructor'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center text-center w-full">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                      formData.role === 'instructor' ? 'bg-primary-100' : 'bg-gray-100'
                    }`}>
                      <GraduationCap className={`h-6 w-6 ${formData.role === 'instructor' ? 'text-primary-600' : 'text-gray-600'}`} />
                    </div>
                    <span className={`font-semibold ${formData.role === 'instructor' ? 'text-primary-900' : 'text-gray-900'}`}>
                      Instructor
                    </span>
                    <span className={`text-sm mt-1 ${formData.role === 'instructor' ? 'text-primary-700' : 'text-gray-500'}`}>
                      Teach & earn
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Terms & Privacy */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-600 hover:text-primary-700 transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>

          {/* Free Trial Banner */}
          <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
            <div className="flex items-center justify-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold text-sm">Free to join • No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;