import { ICredential, IUser } from '../types';
import * as crypto from 'crypto';

//Algorithm to be used in both encryption and decryption
const algorithm = 'aes-256-cbc';

/**
 * Function for deriving a Vault key used for encrypting and decrypting the credentials.
 *
 * The function uses a password based key derivation function (PBKDF) and HMAC-SHA-256 for creating the vault key.
 * The key is derived from a concatenated passwordHash and username string, and uses a salt that has been
 * created on account creation and appended to the password hash (thus the salt must be extracted from the pwHash).
 *
 *
 * @param user - attributes username and passwordHash must be present in the user object.
 * @returns Buffer or null - Buffer if key was generated successfully and null if any errors occur.
 */
const createVaultKey = (user: IUser): Buffer | null => {
  try {
    const { username, passwordHash } = user;

    //PasswordHash consists of user password hash and vault key salt, extract them
    const pwHash = passwordHash?.slice(0, -29);
    const vaultKeySalt = passwordHash?.slice(-29);

    //Use password based key derivation (pbkdf2) for generating vault key.
    const vaultKey = crypto.pbkdf2Sync(
      pwHash! + username!, //concat pwHash and username
      vaultKeySalt!, //use extracted vaultKeySalt as salt
      10000, //Amount of iterations (as high as possible but still performs relatively fast)
      32,
      'sha256' //Actually uses HMAC-SHA-256
    );

    return Buffer.from(vaultKey);

    //In case there are any errors during the pbkdf2Sync function -> return null
  } catch (err) {
    return null;
  }
};

/**
 * Function for encrypting credentials before sending them to backend for storing in the database.
 *
 * Crypto standard library is used with AES-256-cbc algorithm. Initial vector is created using
 * CSPRNG function crypto.randomBytes() and vaultKey is derived using createVaultKey function.
 *
 * Finally after successful encryption of credential, the created iv is appended to the encrypted credential string
 * so that it can be decrypted later using that same iv.
 *
 * @param credential object to be encrypted.
 * @param user object that is required for deriving the vaultKey.
 * @returns string or null. string (encrypted credential) is returned if encryption is successful, else null is returned.
 */
export const encryptCredential = (
  credential: ICredential,
  user: IUser
): string | null => {
  try {
    //trigger catch clause (return null) if required fields are missing
    if (!user.passwordHash || !user.username || !credential) {
      throw new Error();
    }

    //Stringify the credentials
    const credentialsString = JSON.stringify(credential);

    //Derive vault Key used for encrypting. If fails null is returned.
    const vaultKey = createVaultKey(user);
    if (!vaultKey) {
      throw new Error();
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, vaultKey, iv);

    let encryptCredential = cipher.update(credentialsString, 'utf-8', 'hex');
    encryptCredential += cipher.final('hex');

    //Append iv to the end of the ciphertext so that it can be used when decrypting credentials.
    return `${encryptCredential}${iv.toString('hex')}`;

    // In case there are any problems, just return null
  } catch (err) {
    return null;
  }
};

/**
 * Function for encrypting credentials before sending them to backend for storing in the database.
 *
 * Crypto standard library is used with AES-256-cbc algorithm. Initial vector is extracted
 * from the encrypted credential string and vaultKey is derived using createVaultKey function.
 *
 * Finally after successful decryption the result string is converted to JSON object and returned.
 *
 * @param credential object to be decrypted.
 * @param user object that is required for deriving the vaultKey.
 * @returns ICredential or null. ICredential object is returned if decryption is successful, else null is returned.
 */
export const decryptCredential = (
  encrypted: string | undefined,
  user: IUser
): ICredential | null => {
  try {
    //trigger catch clause (return null) if required fields are missing
    if (!encrypted || !user) {
      throw new Error();
    }

    //Extract cipherText and initialization vector from the `encrypted` string.
    const buffer = Buffer.from(encrypted, 'hex');
    const encrypt = buffer.subarray(0, -16).toString('hex');
    const iv = buffer.subarray(-16);

    //Derive vault Key used for encrypting. If fails null is returned.
    const vaultKey = createVaultKey(user);
    if (!vaultKey) {
      throw new Error();
    }

    const decipher = crypto.createDecipheriv(algorithm, vaultKey, iv);
    let decryptCredential = decipher.update(encrypt, 'hex', 'utf-8');
    decryptCredential += decipher.final('utf-8');

    //Parse the decrypted credential into JSON and return.
    return JSON.parse(decryptCredential) as ICredential;

    // In case there are any problems, just return null
  } catch (err) {
    return null;
  }
};
