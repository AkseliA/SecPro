import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Column from '../FlexWrappers/Column';
import styles from './CredentialListing.module.css';
import Button from '../Button/Button';
import CredentialFormModal from '../CredentialFormModal/CredentialFormModal';
import { ICredential, IUser } from '../../types';
import Row from '../FlexWrappers/Row';
import { decryptCredential } from '../../utils/cryptoUtils';
import DeleteConfirmationModal from '../DeleteConfirmationModal/DeleteConfirmationModal';

const CredentialListing = ({
  setUser,
  user
}: {
  setUser: Dispatch<SetStateAction<IUser | null>>;
  user: IUser;
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<ICredential[]>([]);

  //When the component loads (or user state changes) fetch all credentials of user
  useEffect(() => {
    const fetchCredentials = async () => {
      setCredentials([]);
      const data = await fetch('http://localhost:3000/credentials', {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.accessToken}`
        }
      })
        .then(res => res.json())
        .catch(() => {});

      if (data?.credentials) {
        //Loop through returned credentials and decrypt them.
        const decryptedCredentials = data.credentials
          .map((cred: ICredential) => {
            const decryptedCred = decryptCredential(cred?.content, user);

            //If the decryptCredential function fails, a null is returned.
            if (!decryptedCred) {
              return null;
            }
            return {
              ...decryptedCred,
              ...cred
            };
          })
          //Finally filter out null values (where decrypt failed for reason or another)
          .filter((cred: ICredential) => cred !== null);

        setCredentials(decryptedCredentials);
      }
    };

    if (user) {
      fetchCredentials().then(() => {});
    }
  }, [user]);

  return (
    <Row width={'100%'} justifyContent={'center'}>
      <Column className={styles.content}>
        <Row width={'100%'} justifyContent={'space-between'}>
          <h2>Your credentials</h2>

          <Button
            className={styles.logoutButton}
            variant={'secondary'}
            onClick={() => {
              setUser(null);
            }}
          >
            Logout
          </Button>
        </Row>

        <table className={styles.credentialTable}>
          <thead>
            <tr style={{ background: '#cdcdcd', borderColor: '#cdcdcd' }}>
              <th style={{ textAlign: 'start' }} scope="col">
                Website
              </th>
              <th style={{ textAlign: 'start' }} scope="col">
                Username
              </th>
              <th style={{ textAlign: 'center' }} scope="col">
                Password
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {credentials &&
              credentials.map((c: ICredential, index: number) => (
                <CredentialRow
                  credential={c}
                  user={user}
                  key={index}
                  setCredentials={setCredentials}
                />
              ))}
          </tbody>
        </table>

        {modalOpen && (
          <CredentialFormModal
            setOpen={setModalOpen}
            user={user}
            updateCredentialsList={setCredentials}
          />
        )}
        <Button
          className={styles.addNewCredentialButton}
          onClick={() => setModalOpen(true)}
          variant={'primary'}
        >
          Add new credential &#9998;
        </Button>
      </Column>
    </Row>
  );
};
export default CredentialListing;

const CredentialRow = ({
  credential,
  user,
  setCredentials
}: {
  credential: ICredential;
  user: IUser;
  setCredentials: Dispatch<SetStateAction<ICredential[]>>;
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  return (
    <>
      <tr className={styles.credentialRow}>
        <td>{credential.website}</td>
        <td>{credential.username}</td>
        <td
          style={{
            textAlign: 'center',
            fontSize: 14,
            color: '#333'
          }}
        >
          ●●●●●●●●
        </td>
        <td style={{ textAlign: 'end' }}>
          <Button
            className={`${styles.chevron} ${
              open ? styles.chevronUp : styles.chevronDown
            }`}
            onClick={() => {
              setOpen(!open);
            }}
            variant="text"
          >
            <span>&#8249;</span>
          </Button>
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          <div
            className={
              open
                ? styles.additionalInfoContainer
                : `${styles.additionalInfoContainer} ${styles.collapsed}`
            }
          >
            <Row justifyContent={'space-between'}>
              {credential?.created_at && (
                <p
                  style={{ color: 'var(--grey-light)', fontSize: '14px' }}
                >{`Created ${new Date(credential.created_at).toLocaleDateString(
                  'fi-FI'
                )}`}</p>
              )}
              {credential?.updated_at && (
                <p
                  style={{ color: 'var(--grey-light)', fontSize: '14px' }}
                >{`Updated ${new Date(
                  credential?.updated_at
                ).toLocaleDateString('fi-FI')}`}</p>
              )}
            </Row>

            <Row justifyContent={'space-between'}>
              <Button
                className={styles.updateCredentialButton}
                onClick={() => {
                  setModalOpen(true);
                }}
                variant={'text'}
              >
                Update
              </Button>
              <Button
                className={styles.updateCredentialButton}
                onClick={() => {
                  setShowDeleteModal(true);
                }}
                variant={'text'}
              >
                Delete
              </Button>
            </Row>
            {showDeleteModal && (
              <DeleteConfirmationModal
                setOpen={setShowDeleteModal}
                user={user}
                credentialToDelete={credential}
                updateCredentialsList={setCredentials}
              />
            )}
            {modalOpen && (
              <CredentialFormModal
                setOpen={setModalOpen}
                user={user}
                update={true}
                credentialToUpdate={credential}
                updateCredentialsList={setCredentials}
              />
            )}
          </div>
        </td>
      </tr>
    </>
  );
};
