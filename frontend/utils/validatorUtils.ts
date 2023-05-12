/**
 * Function to validate that password meets min requirements when registering an user
 * bcrypt allows only 72 bytes of data in the hashing, so password is limited to 64 characters to be on the safe side.
 * Since password is stored as hash ( > 64chars) also the plaintext password length must be checked before proceeding
 *
 * Requirements (https://pages.nist.gov/800-63-3/sp800-63b.html Appendix A - A.1):
 *  - length 8 - 64 characters
 *  - atleast 1 x digit
 *  - atleast 1 x special character
 *  - atleast 1 x uppercase and lowercase letters
 *
 * @param password
 * @returns boolean - indicates if is valid (true) or not valid (false)
 */

import { ICredential } from '../types';

export const isValidPassword = (password: string): boolean => {
  //Length requirement
  if (password?.length < 8 || password?.length > 64) {
    return false;
  }
  //Regex for checking that password has atleast 1x digit, symbol, upper&lowercase characters
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[,._\-*~"<>/|!@#$%^&()+=])[A-Za-z\d,._\-*~"<>/|!@#$%^&()+=]+$/;
  if (!regex.test(password)) {
    return false;
  }

  return true;
};

/**
 * Function for checking that the username supplied (in registration) is valid.
 * When storing the username in database, additional validation is done against defined jsonSchema (in userModel)
 * Requirements:
 *  - Length between 5 - 32 characters
 *  - Does not have whitespaces
 *
 * @param username
 * @returns boolean - indicates if is valid (true) or not valid (false)
 */
export const isValidUsername = (username: string): boolean => {
  const trimmed = username.trim(); //remove whitespaces
  if (trimmed?.length < 5 || trimmed?.length > 32) {
    return false;
  }
  if (trimmed !== username) {
    return false;
  }
  return true;
};

/**
 * Function for checking that the all required fields of credential (to be stored) are filled
 *
 * @param username
 * @returns boolean - indicates if is valid (true) or not valid (false)
 */
export const validateCredentialForm = (
  credential: ICredential
): { valid: boolean; errors: string[] } => {
  const { notes, password, username, website } = credential;
  let validationResult: { valid: boolean; errors: string[] } = {
    valid: false,
    errors: []
  };

  if (
    !password ||
    !password?.trim() ||
    !username ||
    !username?.trim() ||
    !website ||
    !website?.trim()
  ) {
    validationResult.errors.push(
      'Check that all required fields (*) are filled'
    );
    return validationResult;
  }

  if (website.length > 64) {
    validationResult.errors.push('Website must not exceed 64 characters');
  }
  if (username.length > 32) {
    validationResult.errors.push('Username must not exceed 32 characters');
  }
  if (password.length > 64) {
    validationResult.errors.push('Password must not exceed 64 characters');
  }
  if (notes && notes.length > 128) {
    validationResult.errors.push('Notes must not exceed 128 characters.');
  }

  if (validationResult.errors.length === 0) {
    validationResult.valid = true;
  }
  return validationResult;
};
