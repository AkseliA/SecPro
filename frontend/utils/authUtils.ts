import { IUser } from '../types';

export const register = async (user: IUser) => {
  const res = await fetch('http://localhost:3000/user/register', {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
    .then(res => {
      if (!res.ok) {
        return null;
      }
      return res.json();
    })
    .catch(() => {
      return null;
    });

  return res ? true : false;
};

export const login = async (user: IUser) => {
  const res = await fetch('http://localhost:3000/user/login', {
    method: 'POST',
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
    .then(res => {
      if (!res.ok) {
        return null;
      }
      return res.json();
    })
    .catch(() => {
      return null;
    });

  return res ? res : false;
};
