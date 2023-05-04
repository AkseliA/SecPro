import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Row from '../FlexWrappers/Row';
import Column from '../FlexWrappers/Column';
import Button from '../Button/Button';
import styles from './CredentialFormModal.module.css';
import { ICredential, IUser } from '../../types';
import { decryptCredential, encryptCredential } from '../../utils/cryptoUtils';
import { generatePassword } from '../../utils/generatorUtils';
import { validateCredentialForm } from '../../utils/validatorUtils';

interface IProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  user: IUser;
  update?: boolean;
  credentialToUpdate?: ICredential;
  updateCredentialsList: Dispatch<SetStateAction<ICredential[]>>;
}

const CredentialFormModal = ({
  setOpen,
  user,
  update,
  credentialToUpdate,
  updateCredentialsList
}: IProps) => {
  const [credential, setCredential] = useState<ICredential>({
    website: '',
    username: '',
    password: '',
    notes: ''
  });
  const [passwordsMatch, setPasswordsMatch] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [infoText, setInfoText] = useState<string[]>(['']);

  useEffect(() => {
    if (credentialToUpdate) {
      setCredential({
        website: credentialToUpdate?.website,
        username: credentialToUpdate?.username,
        password: credentialToUpdate?.password,
        notes: credentialToUpdate?.notes
      });
    }
  }, [credentialToUpdate]);

  const handleClose = () => {
    setOpen(false);
  };
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click occurred outside of the modal container
    if ((event.target as HTMLDivElement).className.includes('modalOverlay')) {
      handleClose();
    }
  };

  const handleSubmit = () => {
    setSubmitting(true);

    const validation = validateCredentialForm(credential);
    if (!validation.valid) {
      setInfoText(validation.errors);
      return;
    }
    if (!passwordsMatch) {
      setInfoText(['Passwords mismatch']);
      return;
    }

    //Encrypt the credential before storing
    const encryptedCredentials = encryptCredential(credential, user);
    if (!encryptedCredentials) {
      return;
    }

    if (update && credentialToUpdate) {
      fetch('http://localhost:3000/credentials', {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({
          credential: encryptedCredentials?.toString(),
          id: credentialToUpdate.id
        })
      })
        .then(res => res.json())
        .then(data => {
          setOpen(false);
          const decryptedCredential = decryptCredential(data[0].content, user);

          //update credentialListing state
          if (decryptedCredential) {
            updateCredentialsList((prevList: ICredential[]) =>
              prevList.map((cred: ICredential) => {
                if (cred.id === credentialToUpdate.id) {
                  return { ...decryptedCredential, ...data[0] };
                } else {
                  return cred;
                }
              })
            );
          }
        })
        .catch(() => {});
    } else if (!update) {
      fetch('http://localhost:3000/credentials', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`
        },
        body: JSON.stringify({ credential: encryptedCredentials?.toString() })
      })
        .then(res => res.json())
        .then(data => {
          setOpen(false);
          const decryptedCredential = decryptCredential(data.content, user);

          //update credentialListing state
          if (decryptedCredential) {
            updateCredentialsList(prev => [
              ...prev,
              { ...decryptedCredential, ...data }
            ]);
          }
        })
        .catch(() => {});
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    type: string
  ): void => {
    setCredential({ ...credential, [type]: e.target.value });
  };

  const handlePasswordConfirmationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setPasswordsMatch(e.target.value === credential.password);
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        <Column className={styles.formContent}>
          <h2>{update ? 'Update credential' : 'Add new credential'}</h2>

          <Column gap={'8px'} width={'100%'}>
            <Column gap={'2px'}>
              <label className={styles.label}>Website *</label>
              <input
                className={styles.inputField}
                required
                type={'text'}
                placeholder={'Website *'}
                value={credential?.website}
                onChange={e => handleChange(e, 'website')}
              />
            </Column>

            <Column gap={'2px'}>
              <label className={styles.label}>Username *</label>
              <input
                className={styles.inputField}
                required
                type={'text'}
                placeholder={'Username *'}
                value={credential?.username}
                onChange={e => handleChange(e, 'username')}
              />
            </Column>

            <Column gap={'2px'}>
              <label className={styles.label}>Password *</label>
              <Row gap={'8px'} className={styles.relative}>
                <input
                  className={styles.inputField}
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder={'Password *'}
                  value={credential?.password}
                  onChange={e => handleChange(e, 'password')}
                />
                <button
                  className={styles.showPasswordButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <span>&#x1F6AB;</span>
                  ) : (
                    <span>&#x1F441;</span>
                  )}
                </button>
              </Row>
            </Column>

            <Column gap={'2px'}>
              <label className={styles.label}>Password confirmation *</label>
              <Row gap={'8px'} className={styles.relative}>
                <input
                  className={styles.inputField}
                  required
                  type={showPassword ? 'text' : 'password'}
                  placeholder={'Password confirmation *'}
                  onChange={e => handlePasswordConfirmationChange(e)}
                />
                <button
                  className={styles.showPasswordButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <span>&#x1F6AB;</span>
                  ) : (
                    <span>&#x1F441;</span>
                  )}
                </button>
              </Row>
            </Column>

            <Button
              onClick={() => {
                setShowPassword(true);
                setCredential({
                  ...credential,
                  password:
                    generatePassword({
                      length: 16,
                      uppercase: true,
                      lowercase: true,
                      numbers: true,
                      specialCharacters: true
                    }) ?? ''
                });
              }}
              variant={'primary'}
            >
              Generate strong password
            </Button>

            <Column gap={'2px'}>
              <label className={styles.label}>
                Notes ({credential?.notes?.length} characters)
              </label>
              <textarea
                maxLength={128}
                className={`${styles.inputField} ${styles.textarea}`}
                placeholder={'Notes'}
                value={credential?.notes?.toString()}
                onChange={e => handleChange(e, 'notes')}
                rows={5}
              />
            </Column>

            {infoText && submitting && (
              <Column>
                {infoText.map((text: string, index: number) => (
                  <p key={index} className={styles.warningText}>
                    {text}
                  </p>
                ))}
              </Column>
            )}
          </Column>
          <Row gap={'8px'}>
            <Button onClick={handleSubmit} variant={'primary'}>
              {update ? 'Update' : 'Create'}
            </Button>
            <Button onClick={handleClose} variant={'secondary'}>
              Cancel
            </Button>
          </Row>
        </Column>
      </div>
    </div>
  );
};

export default CredentialFormModal;
