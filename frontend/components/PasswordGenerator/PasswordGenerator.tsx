import Button from '../Button/Button';
import Column from '../FlexWrappers/Column';
import Row from '../FlexWrappers/Row';
import React, { useState } from 'react';
import styles from './PasswordGenerator.module.css';
import { generatePassword } from '../../utils/generatorUtils';
import { IPasswordSettings } from '../../types';

const PasswordGenerator = () => {
  const [generatedPass, setGeneratedPass] = useState<string | null>();
  const [settings, setSettings] = useState<IPasswordSettings>({
    length: 12,
    uppercase: true,
    lowercase: true,
    numbers: true,
    specialCharacters: true
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: keyof IPasswordSettings
  ): void => {
    const updatedValue: string | boolean =
      type === 'length' ? e.target.value : e.target.checked;
    setSettings({ ...settings, [type]: updatedValue });
  };

  const handleSubmit = () => {
    const result = generatePassword(settings);
    setGeneratedPass(result);
  };
  const copyToClipboard = () => {
    if (generatedPass) {
      navigator.clipboard.writeText(generatedPass);
    }
  };
  return (
    <Row width={'100%'} justifyContent={'center'}>
      <Column className={styles.generatorContent}>
        <h2>Generate password</h2>

        {generatedPass && generatedPass?.trim()?.length > 0 && (
          <p className={styles.generatedPasswordText}>{generatedPass}</p>
        )}

        <Row gap={'8px'}>
          <Button onClick={handleSubmit} variant={'primary'}>
            Generate
          </Button>

          {generatedPass && generatedPass?.trim()?.length > 0 && (
            <Button onClick={copyToClipboard} variant={'secondary'}>
              Copy
            </Button>
          )}
        </Row>

        <Column>
          <h3>Settings</h3>
          <Row gap={'8px'}>
            <label htmlFor={'length-slider'}>Length</label>
            <input
              className={styles.slider}
              id={'length-slider'}
              type={'range'}
              min={'6'}
              max={'64'}
              step={'1'}
              value={settings.length}
              onChange={e => handleChange(e, 'length')}
            />
            <input
              type={'number'}
              value={settings.length}
              min={'6'}
              max={'64'}
              onChange={e => handleChange(e, 'length')}
            />
          </Row>
          <Row gap={'8px'}>
            <label htmlFor={'capital-checkbox'}>Capital letters</label>
            <input
              className={styles.checkbox}
              id={'capital-checkbox'}
              type={'checkbox'}
              checked={settings.uppercase}
              onChange={e => handleChange(e, 'uppercase')}
            />
          </Row>
          <Row gap={'8px'}>
            <label htmlFor={'lowercase-checkbox'}>Lowercase letters</label>
            <input
              className={styles.checkbox}
              id={'lowercase-checkbox'}
              type={'checkbox'}
              checked={settings.lowercase}
              onChange={e => handleChange(e, 'lowercase')}
            />
          </Row>
          <Row gap={'8px'}>
            <label htmlFor={'numbers-checkbox'}>Numbers</label>
            <input
              className={styles.checkbox}
              id={'numbers-checkbox'}
              type={'checkbox'}
              checked={settings.numbers}
              onChange={e => handleChange(e, 'numbers')}
            />
          </Row>
          <Row gap={'8px'}>
            <label htmlFor={'special-checkbox'}>Special characters</label>
            <input
              className={styles.checkbox}
              id={'special-checkbox'}
              type={'checkbox'}
              checked={settings.specialCharacters}
              onChange={e => handleChange(e, 'specialCharacters')}
            />
          </Row>
        </Column>
      </Column>
    </Row>
  );
};
export default PasswordGenerator;
