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
  try {
    //CSPRNG method for creating random ints
    const bytes = randomBytes(256);
    if (!bytes) return null;

    //convert the bytes into an array of unsigned 8 bit integers
    const randomInts = Array.from(new Uint8Array(bytes));
    const validInts = randomInts.filter(n => n <= 251);

    //Create the characterset
    let charset = '';
    Object.entries(possibleCharacters).forEach(([key, value]) => {
      if (settings[key]) {
        charset += value;
      }
    });
    //Return "Invalid settings" if characterset was not created
    if (charset.length === 0) {
      return 'Invalid settings';
    }

    let generatedPassword = '';
    //Create password of defined length by mapping the random integers to characters in charset
    for (let i = 0; i < settings.length; i++) {
      const randomIndex = validInts[i] % charset.length;
      generatedPassword += charset.slice(randomIndex, randomIndex + 1);
    }

    return generatedPassword;

    //Something went wrong, return null
  } catch (err) {
    return null;
  }
};
