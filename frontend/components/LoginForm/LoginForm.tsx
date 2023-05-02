import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Dispatch, SetStateAction, useState } from 'react';
import Button from '../Button/Button';
import Column from '../FlexWrappers/Column';
import Row from '../FlexWrappers/Row';
import styles from './LoginForm.module.css';
import { login } from '../../utils/authUtils';
import { IAuthState, IUser } from '../../types';

const LoginForm = ({
  setAuthState,
  setUser
}: {
  setAuthState: Dispatch<SetStateAction<IAuthState>>;
  setUser: Dispatch<SetStateAction<IUser | null>>;
}) => {
  const { push } = useRouter();
  const [infoMessage, setInfoMessage] = useState<String>('');
  const [data, setData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ): void => {
    setData({ ...data, [type]: e.target.value });
  };

  const handleSubmit = async () => {
    const response = await login(data);
    console.log(response);
    if (response) {
      setAuthState({ authenticated: true });
      setUser({ ...response });
      setInfoMessage('');
    } else {
      setInfoMessage('Login failed.');
    }
  };

  return (
    <Row width={'100%'} justifyContent={'center'}>
      <Column className={styles.formContent}>
        <h2>Login</h2>
        <Column gap={'8px'}>
          {infoMessage && (
            <p style={{ color: 'red', fontWeight: 700 }}>{infoMessage}</p>
          )}
          <input
            className={styles.inputField}
            type={'text'}
            placeholder={'username'}
            value={data.username}
            onChange={e => handleChange(e, 'username')}
          />
          <input
            className={styles.inputField}
            type={'password'}
            placeholder={'password'}
            value={data.password}
            onChange={e => handleChange(e, 'password')}
          />
        </Column>
        <Row gap={'8px'}>
          <Button onClick={handleSubmit} variant={'primary'}>
            Login
          </Button>
          <Button onClick={() => push('/')} variant={'secondary'}>
            Cancel
          </Button>
        </Row>
        <Link href={'/register'}>
          Do not have an account? Click to register
        </Link>
      </Column>
    </Row>
  );
};
export default LoginForm;
