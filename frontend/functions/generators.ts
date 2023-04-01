import { randomBytes } from 'crypto';
/**
 * Generates passwords in a following way:
 *  - First a CSPRNG (Cryptographically Secure Pseudo-Random Number Generator)
 *      is used for generating a "seed". For this purpose a
 *  - The seed is then mapped into a characterset defined by the user
 * @returns generatedPassword or null
 */
export const generatePassword = (length: number): string | null => {
  const bytes = randomBytes(256);
  if (!bytes) return null;

  const randomNumbers = bytes
    .toString('hex')
    .replace(/[^0-9.]/g, '')
    .slice(0, length);

  /**
   * @TODO map the numbers to characters
   */
  return randomNumbers;
};
