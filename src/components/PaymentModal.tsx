import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import type { Course } from '../types';

interface PaymentModalProps {
  course: Course;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ course, onClose, onPaymentSuccess }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'momo'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Card payment form state
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  // Mobile money form state
  const [momoData, setMomoData] = useState({
    phoneNumber: '',
    provider: 'mtn',
    pin: '',
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value);
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setCardData(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const handleMomoInputChange = (field: string, value: string) => {
    if (field === 'phoneNumber') {
      value = value.replace(/\D/g, '');
    } else if (field === 'pin') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }

    setMomoData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateCardData = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = cardData;
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    
    if (!cardholderName.trim()) return 'Cardholder name is required';
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) return 'Invalid card number';
    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) return 'Invalid expiry date (MM/YY)';
    if (cvv.length < 3 || cvv.length > 4) return 'Invalid CVV';
    
    return null;
  };

  const validateMomoData = () => {
    const { phoneNumber, pin } = momoData;
    
    if (phoneNumber.length < 10) return 'Invalid phone number';
    if (pin.length !== 4) return 'PIN must be 4 digits';
    
    return null;
  };

  const processPayment = async () => {
    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    try {
      // Validate form data
      const validationError = paymentMethod === 'card' ? validateCardData() : validateMomoData();
      if (validationError) {
        throw new Error(validationError);
      }

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 2000));

      // Simulate random payment failure (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Payment failed. Please try again or use a different payment method.');
      }

      setPaymentStatus('success');
      
      // Wait a moment to show success message
      setTimeout(() => {
        onPaymentSuccess();
        onClose();
      }, 2000);

    } catch (error) {
      setPaymentStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
      setIsProcessing(false);
    }
  };

  const momoProviders = [
    { value: 'mtn', label: 'MTN Mobile Money', color: 'bg-yellow-500' },
    { value: 'airtel', label: 'Airtel Money', color: 'bg-red-500' },
    { value: 'tigo', label: 'Tigo Cash', color: 'bg-blue-500' },
    { value: 'vodafone', label: 'Vodafone Cash', color: 'bg-red-600' },
  ];

  if (paymentStatus === 'success') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 mb-4">
            You have successfully enrolled in "{course.title}". You can now start learning!
          </p>
          <div className="w-full bg-green-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full animate-pulse"></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">Redirecting you to the course...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
              <p className="text-sm text-gray-600">{course.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isProcessing}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Course Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Course Fee</p>
              <p className="text-2xl font-bold text-gray-900">${course.price}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Level</p>
              <p className="text-sm font-medium capitalize">{course.level}</p>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="p-6">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setPaymentMethod('card')}
              className={`flex-1 flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors ${
                paymentMethod === 'card'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              disabled={isProcessing}
            >
              <CreditCard className="h-5 w-5" />
              <span>Card</span>
            </button>
            <button
              onClick={() => setPaymentMethod('momo')}
              className={`flex-1 flex items-center justify-center space-x-2 p-3 border rounded-lg transition-colors ${
                paymentMethod === 'momo'
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
              disabled={isProcessing}
            >
              <Smartphone className="h-5 w-5" />
              <span>Mobile Money</span>
            </button>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardData.cardholderName}
                  onChange={(e) => handleCardInputChange('cardholderName', e.target.value)}
                  className="input-field"
                  placeholder="John Doe"
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardData.cardNumber}
                  onChange={(e) => handleCardInputChange('cardNumber', e.target.value)}
                  className="input-field"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  disabled={isProcessing}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardData.expiryDate}
                    onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                    className="input-field"
                    placeholder="MM/YY"
                    maxLength={5}
                    disabled={isProcessing}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                    className="input-field"
                    placeholder="123"
                    maxLength={4}
                    disabled={isProcessing}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Money Form */}
          {paymentMethod === 'momo' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Money Provider
                </label>
                <select
                  value={momoData.provider}
                  onChange={(e) => handleMomoInputChange('provider', e.target.value)}
                  className="input-field"
                  disabled={isProcessing}
                >
                  {momoProviders.map(provider => (
                    <option key={provider.value} value={provider.value}>
                      {provider.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={momoData.phoneNumber}
                  onChange={(e) => handleMomoInputChange('phoneNumber', e.target.value)}
                  className="input-field"
                  placeholder="0241234567"
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Money PIN
                </label>
                <input
                  type="password"
                  value={momoData.pin}
                  onChange={(e) => handleMomoInputChange('pin', e.target.value)}
                  className="input-field"
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  disabled={isProcessing}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {paymentStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          )}

          {/* Security Notice */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg flex items-center space-x-2">
            <Lock className="h-4 w-4 text-gray-600" />
            <p className="text-xs text-gray-600">
              Your payment information is secure and encrypted
            </p>
          </div>

          {/* Payment Button */}
          <button
            onClick={processPayment}
            disabled={isProcessing}
            className={`w-full mt-6 px-4 py-3 rounded-lg font-medium transition-colors ${
              isProcessing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Payment...</span>
              </div>
            ) : (
              `Pay $${course.price}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;