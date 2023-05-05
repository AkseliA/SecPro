import { IUser } from '../types';

/**
 * Function for creating POST request to register endpoint of backend.
 *
 * @param user - the credentials user supplied (username & password)
 * @returns boolean - either true if successful registration or null if failed registration
 */
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

/**
 *  Function for creating POST request to login endpoint of backend
 *
 * @param user - the credentials user supplied (username & password)
 * @returns either the response (user and token) or null
 */
export const login = async (user: IUser) => {
  const { username, password } = user;
  //If password or username does not exist or are empty, return null.
  if (!username || !username.trim() || !password || !password.trim()) {
    return null;
  }

  //Fetch request to backend. Return null if res is not ok.
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
