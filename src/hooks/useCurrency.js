import { useState } from 'react';

// Simple currency hook - defaults to USD
export function useCurrency() {
  const [currency] = useState('USD');

  const currencyMap = {
    USD: { symbol: '$', code: 'USD', name: 'US Dollar' },
    EUR: { symbol: '€', code: 'EUR', name: 'Euro' },
    GBP: { symbol: '£', code: 'GBP', name: 'British Pound' },
    NGN: { symbol: '₦', code: 'NGN', name: 'Nigerian Naira' },
    KES: { symbol: 'KSh', code: 'KES', name: 'Kenyan Shilling' },
    ZAR: { symbol: 'R', code: 'ZAR', name: 'South African Rand' },
  };

  return currencyMap[currency] || currencyMap.USD;
}
