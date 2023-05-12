import {
  isValidPassword,
  isValidUsername,
  validateCredentialForm
} from '../utils/validatorUtils';

describe('isValidPassword', () => {
  it('should return false for empty string', () => {
    expect(isValidPassword('')).toBe(false);
  });

  it('should return false for password length less than 8', () => {
    expect(isValidPassword('aBcDe1')).toBe(false);
  });

  it('should return false for password length greater than 64', () => {
    const longPassword = 'a'.repeat(65);
    expect(isValidPassword(longPassword)).toBe(false);
  });

  it('should return false for password without uppercase characters', () => {
    expect(isValidPassword('abcd1234!')).toBe(false);
  });

  it('should return false for password without lowercase characters', () => {
    expect(isValidPassword('ABCD1234!')).toBe(false);
  });

  it('should return false for password without digits', () => {
    expect(isValidPassword('Abcdefgh!')).toBe(false);
  });

  it('should return false for password without special characters', () => {
    expect(isValidPassword('Abcdefgh1234')).toBe(false);
  });

  it('should return true for password with all requirements met', () => {
    expect(isValidPassword('Abcdefgh1234!')).toBe(true);
  });
});

describe('isValidUsername function', () => {
  it('returns true for valid usernames', () => {
    expect(isValidUsername('john.doe')).toBe(true);
    expect(isValidUsername('johndoe')).toBe(true);
    expect(isValidUsername('john-doe')).toBe(true);
    expect(isValidUsername('john_doe')).toBe(true);
    expect(isValidUsername('john.doe123')).toBe(true);
    expect(isValidUsername('john-doe-123')).toBe(true);
    expect(isValidUsername('john_doe_123')).toBe(true);
    expect(isValidUsername('JohnDoe')).toBe(true);
    expect(isValidUsername('John.Doe')).toBe(true);
    expect(isValidUsername('John-Doe')).toBe(true);
    expect(isValidUsername('John_Doe')).toBe(true);
    expect(isValidUsername('JohnDoe123')).toBe(true);
    expect(isValidUsername('John-Doe-123')).toBe(true);
    expect(isValidUsername('John_Doe_123')).toBe(true);
  });

  it('returns false for usernames that are too short', () => {
    expect(isValidUsername('')).toBe(false);
    expect(isValidUsername('a')).toBe(false);
    expect(isValidUsername('abc')).toBe(false);
    expect(isValidUsername('abcd')).toBe(false);
  });

  it('returns false for usernames that are too long', () => {
    expect(isValidUsername('abcdefghijklmnopqrstuvwxyz1234567')).toBe(false);
    expect(isValidUsername('john_doe_12345678901234567890123456789')).toBe(
      false
    );
  });

  it('should return false for usernames with leading/trailing whitespaces', () => {
    expect(isValidUsername(' username')).toBe(false);
    expect(isValidUsername('username ')).toBe(false);
    expect(isValidUsername(' user name ')).toBe(false);
  });
});

describe('validateCredentialForm', () => {
  it('should return valid true and no errors for valid credentials', () => {
    const credential = {
      website: 'example.com',
      username: 'user123',
      password: 'Abc123@',
      notes: ''
    };
    const result = validateCredentialForm(credential);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return valid false and errors if any required fields are missing', () => {
    const credential = {
      website: 'example.com',
      username: '',
      password: 'Abc123@',
      notes: ''
    };
    const result = validateCredentialForm(credential);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      'Check that all required fields (*) are filled'
    );
  });

  it('should return valid false and errors if website length is exceeded', () => {
    const credential = {
      website: 'a'.repeat(65),
      username: 'user123',
      password: 'Abc123@',
      notes: ''
    };
    const result = validateCredentialForm(credential);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Website must not exceed 64 characters');
  });

  it('should return valid false and errors if username length is exceeded', () => {
    const credential = {
      website: 'example.com',
      username: 'a'.repeat(33),
      password: 'Abc123@',
      notes: ''
    };
    const result = validateCredentialForm(credential);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Username must not exceed 32 characters');
  });

  it('should return valid false and errors if password length is exceeded', () => {
    const credential = {
      website: 'example.com',
      username: 'user123',
      password: 'a'.repeat(65),
      notes: ''
    };
    const result = validateCredentialForm(credential);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Password must not exceed 64 characters');
  });

  it('should return valid false and errors if notes length is exceeded', () => {
    const credential = {
      website: 'example.com',
      username: 'user123',
      password: 'Abc123@',
      notes: 'a'.repeat(129)
    };
    const result = validateCredentialForm(credential);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Notes must not exceed 128 characters.');
  });
});
