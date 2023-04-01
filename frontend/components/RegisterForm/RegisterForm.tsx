import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Button from '../Button/Button';
import Column from '../FlexWrappers/Column';
import Row from '../FlexWrappers/Row';
import styles from './RegisterForm.module.css';

const RegisterForm = () => {
  const { push } = useRouter();
  const [infoText, setInfoText] = useState<string>('');
  const [data, setData] = useState({
    username: '',
    password: '',
    passwordConfirmation: ''
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ): void => {
    setData({ ...data, [type]: e.target.value });
  };

  const handleSubmit = () => {
    console.log(data);
    if (data.password !== data.passwordConfirmation) {
      setInfoText('Passwords differ');
      return;
    }
    setInfoText('rekisteröidään');
  };

  return (
    <Row width={'100%'} justifyContent={'center'}>
      <Column className={styles.formContent}>
        <h2>Register</h2>
        <Column gap={'8px'}>
          <p style={{ color: 'red', fontWeight: 700 }}>{infoText}</p>
          <input
            className={styles.inputField}
            placeholder="Username"
            type={'text'}
            value={data.username}
            onChange={e => handleChange(e, 'username')}
          />
          <input
            className={styles.inputField}
            placeholder="Password"
            type={'password'}
            value={data.password}
            onChange={e => handleChange(e, 'password')}
          />
          <input
            className={styles.inputField}
            placeholder="Confirm password"
            type={'password'}
            value={data.passwordConfirmation}
            onChange={e => handleChange(e, 'passwordConfirmation')}
          />
        </Column>
        <Row gap={'8px'}>
          <Button onClick={handleSubmit} variant={'primary'}>
            Register
          </Button>
          <Button onClick={() => push('/')} variant={'secondary'}>
            Cancel
          </Button>
        </Row>
        <Link href={'/login'}>Already registered? Click to login</Link>
      </Column>
    </Row>
  );
};
export default RegisterForm;
