import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Button from '../Button/Button';
import Column from '../FlexWrappers/Column';
import Row from '../FlexWrappers/Row';
import styles from './RegisterForm.module.css';
import { register } from '../../utils/authUtils';

const RegisterForm = () => {
  const { push } = useRouter();
  const [data, setData] = useState({
    username: '',
    password: ''
  });
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ): void => {
    setData({ ...data, [type]: e.target.value });
  };
  const handlePasswordConfirmationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPasswordsMatch(e.target.value === data.password);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    if (!passwordsMatch) {
      return;
    }
    const response = await register(data);

    if (response) {
      console.log('success');
    }
  };

  return (
    <Row width={'100%'} justifyContent={'center'}>
      <Column className={styles.formContent}>
        <h2>Register</h2>
        <Column gap={'8px'}>
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
            onChange={e => handlePasswordConfirmationChange(e)}
          />
        </Column>
        {!passwordsMatch && submitting && (
          <p style={{ color: 'red', fontWeight: 700 }}>Passwords mismatch</p>
        )}
        <Row gap={'8px'}>
          <Button onClick={handleSubmit} variant={'primary'}>
            Register
          </Button>
          <Button onClick={() => push('/')} variant={'secondary'}>
            Cancel
          </Button>
        </Row>
        <Link href={'/'}>Already registered? Click to login</Link>
      </Column>
    </Row>
  );
};
export default RegisterForm;
