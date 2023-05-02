export interface IPasswordSettings {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  specialCharacters: boolean;
  [key: string]: string | number | boolean;
}

export interface ICredential {
  id?: string | number;
  website: string;
  username: string;
  password: string;
  notes?: string | null;
  created_at?: string;
  updated_at?: string | null;
  content?: string; //contains the encrypted credentials
}

export interface IUser {
  id?: string | number;
  passwordHash?: string;
  username?: string;
  accessToken?: string;
}

export interface IAuthState {
  authenticated: boolean;
}
