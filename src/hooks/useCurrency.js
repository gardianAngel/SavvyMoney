import { useAuth } from './useAuth';

export const CURRENCIES = [
  { country: 'Nigeria', flag: '🇳🇬', currency: 'NGN', symbol: '₦' },
  { country: 'Ghana', flag: '🇬🇭', currency: 'GHS', symbol: '₵' },
  { country: 'Kenya', flag: '🇰🇪', currency: 'KES', symbol: 'KSh' },
  { country: 'South Africa', flag: '🇿🇦', currency: 'ZAR', symbol: 'R' },
  { country: 'Uganda', flag: '🇺🇬', currency: 'UGX', symbol: 'USh' },
  { country: 'Tanzania', flag: '🇹🇿', currency: 'TZS', symbol: 'TSh' },
  { country: 'Ethiopia', flag: '🇪🇹', currency: 'ETB', symbol: 'Br' },
  { country: 'Egypt', flag: '🇪🇬', currency: 'EGP', symbol: 'E£' },
  { country: 'United States', flag: '🇺🇸', currency: 'USD', symbol: '$' },
  { country: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', symbol: '£' },
  { country: 'Canada', flag: '🇨🇦', currency: 'CAD', symbol: 'CA$' },
  { country: 'Australia', flag: '🇦🇺', currency: 'AUD', symbol: 'A$' },
  { country: 'India', flag: '🇮🇳', currency: 'INR', symbol: '₹' },
  { country: 'Europe', flag: '🇪🇺', currency: 'EUR', symbol: '€' },
  { country: 'Brazil', flag: '🇧🇷', currency: 'BRL', symbol: 'R$' },
  { country: 'Mexico', flag: '🇲🇽', currency: 'MXN', symbol: 'MX$' },
  { country: 'China', flag: '🇨🇳', currency: 'CNY', symbol: '¥' },
  { country: 'Japan', flag: '🇯🇵', currency: 'JPY', symbol: '¥' },
];

export function useCurrency() {
  const { profile } = useAuth();

  const symbol = profile?.currency_symbol || '₦';
  const currency = profile?.currency || 'NGN';
  const country = profile?.country || 'Nigeria';

  const format = (amount) => `${symbol}${Number(amount || 0).toLocaleString()}`;

  return { symbol, currency, country, format };
}
