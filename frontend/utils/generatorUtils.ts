import { randomBytes } from 'crypto';
import { IPasswordSettings } from '../types';

const possibleCharacters = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTYVWXYZ',
  numbers: '0123456789',
  specialCharacters: '(,._-*~"<>/|!@#$%^&)+='
};

/**
 * Generates passwords in a following way:
 *  - First a CSPRNG (Cryptographically Secure Pseudo-Random Number Generator)
 *      is used for generating a "seed". For this purpose a crypto.randomBytes() is used.
 *  - The seed is then mapped into a characterset defined by the user
 * @returns generatedPassword or null
 */

export const generatePassword = (
  settings: IPasswordSettings
): string | null => {
  const bytes = randomBytes(256);
  if (!bytes) return null;
  const randomInts = Array.from(new Uint8Array(bytes));
  const validInts = randomInts.filter(n => n <= 251);

  //Create the characterset
  let charset = '';
  Object.entries(possibleCharacters).forEach(([key, value]) => {
    if (settings[key]) {
      charset += value;
    }
  });
  if (charset.length === 0) {
    return 'Invalid settings';
  }

  let generatedPassword = '';
  for (let i = 0; i < settings.length; i++) {
    const randomIndex = validInts[i] % charset.length;
    generatedPassword += charset.slice(randomIndex, randomIndex + 1);
  }

  return generatedPassword;
};
