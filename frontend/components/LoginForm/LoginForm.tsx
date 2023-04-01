import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Button from '../Button/Button';
import Column from '../FlexWrappers/Column';
import Row from '../FlexWrappers/Row';
import styles from './LoginForm.module.css';

const LoginForm = () => {
  const { push } = useRouter();
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

  const handleSubmit = () => {
    console.log(data);
  };
  return (
    <Row width={'100%'} justifyContent={'center'}>
      <Column className={styles.formContent}>
        <h2>Login</h2>
        <Column gap={'8px'}>
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
