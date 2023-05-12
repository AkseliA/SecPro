import { ICredential, IUser } from '../types';
import * as crypto from 'crypto';
import { decryptCredential, encryptCredential } from '../utils/cryptoUtils';

describe('encryptCredential', () => {
  /**BEGIN mock user and credential to be used in tests */
  const user: IUser = {
    username: 'testuser',
    passwordHash: crypto.randomBytes(64).toString('hex')
  };

  const credential: ICredential = {
    website: 'example.com',
    username: 'johndoe',
    password: 'password123',
    notes: 'example note'
  };
  /**END mock user and credential to be used in tests */

  it('should encrypt credentials successfully', () => {
    const encryptedCredential = encryptCredential(credential, user);
    expect(encryptedCredential).toBeTruthy();
    expect(typeof encryptedCredential).toBe('string');
  });

  it('should return null when a required argument is missing', () => {
    //@ts-ignore
    const encryptedCredential1 = encryptCredential(null, user);
    expect(encryptedCredential1).toBeNull();

    //@ts-ignore
    const encryptedCredential2 = encryptCredential(credential, null);
    expect(encryptedCredential2).toBeNull();
  });
  it('should return null when credential is missing', () => {
    //@ts-ignore
    const encryptedCredential = encryptCredential(undefined, user);
    expect(encryptedCredential).toBeNull();
  });

  it('should return null when user password hash is missing', () => {
    user.passwordHash = undefined;
    const encryptedCredential = encryptCredential(credential, user);
    expect(encryptedCredential).toBeNull();
  });
  it('should return null when user username is missing', () => {
    user.username = undefined;
    const encryptedCredential = encryptCredential(credential, user);
    expect(encryptedCredential).toBeNull();
  });
});

describe('decryptCredential', () => {
  /**BEGIN mock user and credential to be used in tests */
  const user: IUser = {
    username: 'testuser',
    passwordHash: crypto.randomBytes(64).toString('hex')
  };

  const credential: ICredential = {
    website: 'example.com',
    username: 'johndoe',
    password: 'password123',
    notes: 'example note'
  };
  const encryptedCredential = encryptCredential(credential, user)!;
  /**END mock user and credential to be used in tests */

  it('should decrypt credentials successfully', () => {
    const decryptedCredential = decryptCredential(encryptedCredential, user);
    expect(decryptedCredential).toEqual(credential);
  });

  it('should return null when encrypted input is undefined', () => {
    const decryptedCredential = decryptCredential(undefined, user);
    expect(decryptedCredential).toBeNull();
  });

  it('should return null when user input is undefined', () => {
    const decryptedCredential = decryptCredential(
      encryptedCredential,
      //@ts-ignore
      undefined
    );
    expect(decryptedCredential).toBeNull();
  });

  it('should return null when both inputs are undefined', () => {
    //@ts-ignore
    const decryptedCredential = decryptCredential(undefined, undefined);
    expect(decryptedCredential).toBeNull();
  });

  it('should return null when passwordHash missing', () => {
    user.passwordHash = undefined;

    //@ts-ignore
    const decryptedCredential = decryptCredential(undefined, user);
    expect(decryptedCredential).toBeNull();
  });

  it('should return null when username missing', () => {
    user.username = undefined;

    //@ts-ignore
    const decryptedCredential = decryptCredential(undefined, user);
    expect(decryptedCredential).toBeNull();
  });

  it('should return null when given incorrect vault key', () => {
    const maliciousUser: IUser = {
      username: 'testuser',
      passwordHash:
        '9a3321c42411b52e268bf6a41f85f64b8eb75c3a2f22b9b9d2cb8a29031af42b0bbf31a027a5d6f5b5fcb1e299ca54f6e5c06c9d8200c8e0c38d81bea6afbcf6'
    };

    const decryptedCredential = decryptCredential(
      encryptedCredential,
      maliciousUser
    );
    expect(decryptedCredential).toBeNull();
  });
  it('should return null when given incorrect vault key (wrong username)', () => {
    user.username = 'notCorrect';
    const decryptedCredential = decryptCredential(encryptedCredential, user);
    expect(decryptedCredential).toBeNull();
  });

  it('should return null when given incorrect vault key (wrong passwordHash)', () => {
    user.passwordHash =
      '9a3321c42411b52e268bf6a41f85f64b8eb75c3a2f22b9b9d2cb8a29031af42b0bbf31a027a5d6f5b5fcb1e299ca54f6e5c06c9d8200c8e0c38d81bea6afbcf6';
    const decryptedCredential = decryptCredential(encryptedCredential, user);
    expect(decryptedCredential).toBeNull();
  });
});
