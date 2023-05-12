import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Button from '../Button/Button';
import Column from '../FlexWrappers/Column';
import Row from '../FlexWrappers/Row';
import styles from './RegisterForm.module.css';
import { register } from '../../utils/authUtils';
import { isValidPassword, isValidUsername } from '../../utils/validatorUtils';

const RegisterForm = () => {
  const { push } = useRouter();
  const [infoText, setInfoText] = useState<string>('');
  const [data, setData] = useState({
    username: '',
    password: ''
  });
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
    //validate that username meets requirements
    if (!isValidUsername(data.username)) {
      setInfoText(
        'Username must be between 5 - 32 characters and not contain whitespaces'
      );
      return;
    }

    //Validate that passwords match
    if (!passwordsMatch) {
      setInfoText('Passwords mismatch');
      return;
    }

    //Validate that password meets requirements
    if (!isValidPassword(data.password)) {
      setInfoText(
        'Password must be between 8 - 64 characters, have at least 1 uppercase letter, 1 lowercase letter, 1 special character and 1 digit'
      );
      return;
    }

    const response = await register(data);

    if (response) {
      push('/');
    }
  };

  return (
    <Row width={'100%'} justifyContent={'center'}>
      <Column className={styles.formContent}>
        <h2>Register</h2>
        {submitting && infoText && (
          <p className={styles.warningText}>{infoText}</p>
        )}
        <Column gap={'2px'}>
          <label className={styles.label}>Username</label>
          <input
            className={styles.inputField}
            required
            type={'text'}
            placeholder={'Username'}
            value={data?.username}
            onChange={e => handleChange(e, 'username')}
          />
        </Column>

        <Column gap={'2px'}>
          <label className={styles.label}>Password</label>
          <Row gap={'8px'} className={styles.relative}>
            <input
              className={styles.inputField}
              required
              type={showPassword ? 'text' : 'password'}
              placeholder={'Password'}
              value={data?.password}
              onChange={e => handleChange(e, 'password')}
            />
            <button
              className={styles.showPasswordButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <span>&#x1F6AB;</span> : <span>&#x1F441;</span>}
            </button>
          </Row>
        </Column>

        <Column gap={'2px'}>
          <label className={styles.label}>Password confirmation</label>
          <Row gap={'8px'} className={styles.relative}>
            <input
              className={styles.inputField}
              required
              type={showPassword ? 'text' : 'password'}
              placeholder={'Password confirmation'}
              onChange={e => handlePasswordConfirmationChange(e)}
            />
            <button
              className={styles.showPasswordButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <span>&#x1F6AB;</span> : <span>&#x1F441;</span>}
            </button>
          </Row>
        </Column>

        <p
          className={styles.greyText}
          style={{ width: '50%', textAlign: 'center', fontSize: '12px' }}
        >
          Please remember that if you forget your password, you will not be able
          to access your account and your credentials will be{' '}
          <b>permanently lost.</b> We strongly recommend that you keep your
          password safe and secure, and that you do not share it with anyone.
        </p>

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
