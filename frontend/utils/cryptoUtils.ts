import { ICredential, IUser } from '../types';
import * as crypto from 'crypto';

const algorithm = 'aes-256-cbc';

const createVaultKey = (user: IUser): Buffer => {
  const { username, passwordHash } = user;

  //PasswordHash consists of user password hash and vault key salt, extract them
  const pwHash = passwordHash?.slice(0, -29);
  const vaultKeySalt = passwordHash?.slice(-29);

  //Use password based key derivation (pbksd2) for generating vault key.
  const vaultKey = crypto.pbkdf2Sync(
    pwHash! + username!, //concat pwHash and username
    vaultKeySalt!, //use extracted vaultKeySalt as salt
    1000,
    32,
    'sha256'
  );

  return Buffer.from(vaultKey);
};

export const encryptCredential = (
  credential: ICredential,
  user: IUser
): string | null => {
  if (!user.passwordHash || !user.username || !credential) {
    return null;
  }
  //Stringify the credentials:
  const credentialsString = JSON.stringify(credential);

  const vaultKey = createVaultKey(user);

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, vaultKey, iv);
  let encryptCredential = cipher.update(credentialsString, 'utf-8', 'hex');
  encryptCredential += cipher.final('hex');
  //Append iv to the end of the ciphertext so that it can be used when decrypting credentials.
  return `${encryptCredential}${iv.toString('hex')}`;
};

export const decryptCredential = (
  encrypted: string | undefined,
  user: IUser
): ICredential | null => {
  if (!encrypted || !user) {
    return null;
  }
  //Extract cipherText and initialization vector from the `encrypted` string.
  const buffer = Buffer.from(encrypted, 'hex');
  const encrypt = buffer.subarray(0, -16).toString('hex');
  const iv = buffer.subarray(-16);

  const vaultKey = createVaultKey(user);

  const decipher = crypto.createDecipheriv(algorithm, vaultKey, iv);
  let decryptCredential = decipher.update(encrypt, 'hex', 'utf-8');
  decryptCredential += decipher.final('utf-8');

  return JSON.parse(decryptCredential) as ICredential;
};
