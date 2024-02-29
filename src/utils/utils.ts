import { currencies } from './constans/currencies';

export const convertToSubunits = (amount:number, currencyCode: string) => {
  const currency = currencies[currencyCode];
  if (!currency) {
    throw new Error('Invalid currency code');
  }
  const factor = Math.pow(10, currency.decimalPlaces);
  return amount * factor;
}