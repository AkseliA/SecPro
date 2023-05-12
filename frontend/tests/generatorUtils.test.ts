import { generatePassword } from '../utils/generatorUtils';

describe('GeneratePassword function tests', () => {
  it('should generate a password with given settings - all settings on & length 24', () => {
    const settings = {
      length: 24,
      uppercase: true,
      lowercase: true,
      numbers: true,
      specialCharacters: true
    };

    const password = generatePassword(settings);

    expect(password).toHaveLength(24);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$%^&*(),.?":{}|<>]/);
  });

  it('should generate unique password each time the function is run', () => {
    const settings = {
      length: 16,
      uppercase: true,
      lowercase: true,
      numbers: true,
      specialCharacters: true
    };

    const password1 = generatePassword(settings);
    const password2 = generatePassword(settings);

    expect(password1).not.toEqual(password2);
  });

  it('should generate a password with length 8 and only uppercase letters', () => {
    const settings = {
      length: 8,
      uppercase: true,
      lowercase: false,
      numbers: false,
      specialCharacters: false
    };

    const password = generatePassword(settings);

    expect(password).toHaveLength(8);
    expect(password).toMatch(/^[A-Z]+$/);
  });

  it('should generate a password with length 24 and only lowercase letters and numbers', () => {
    const settings = {
      length: 24,
      uppercase: false,
      lowercase: true,
      numbers: true,
      specialCharacters: false
    };

    const password = generatePassword(settings);

    expect(password).toHaveLength(24);
    expect(password).toMatch(/^[a-z0-9]+$/);
  });

  it('should generate a password with length 32 and only symbols and digits', () => {
    const settings = {
      length: 32,
      uppercase: false,
      lowercase: false,
      numbers: true,
      specialCharacters: true
    };

    const password = generatePassword(settings);

    expect(password).toHaveLength(32);
    expect(password).toMatch(/[0-9]/);
    expect(password).toMatch(/[!@#$%^&*(),.?":{}|<>]/);
  });

  it('should return null if settings are invalid', () => {
    const settings = {
      length: 0,
      uppercase: false,
      lowercase: false,
      numbers: false,
      specialCharacters: false
    };

    const password = generatePassword(settings);

    expect(password).toBe('Invalid settings');
  });

  it('should return null if an error occurs', () => {
    const settings = {};
    //@ts-ignore
    const password = generatePassword(settings);

    expect(password).toBe('Invalid settings');
  });

  it('should return "Invalid settings" if characterset is empty', () => {
    const settings = {
      length: 12,
      uppercase: false,
      lowercase: false,
      numbers: false,
      specialCharacters: false
    };

    const password = generatePassword(settings);

    expect(password).toBe('Invalid settings');
  });
});
