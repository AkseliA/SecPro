import React, { Dispatch, SetStateAction } from 'react';
import Row from '../FlexWrappers/Row';
import Column from '../FlexWrappers/Column';
import Button from '../Button/Button';
import styles from './DeleteConfirmationModal.module.css';
import { ICredential, IUser } from '../../types';

interface IProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
  user: IUser;
  credentialToDelete: ICredential;
  updateCredentialsList: Dispatch<SetStateAction<ICredential[]>>;
}

const DeleteConfirmationModal = ({
  setOpen,
  user,
  credentialToDelete,
  updateCredentialsList
}: IProps) => {
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
    fetch(`http://localhost:3000/credentials/${credentialToDelete.id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.accessToken}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setOpen(false);
        if (data === 1) {
          updateCredentialsList((prev: ICredential[]) =>
            prev.filter(
              (cred: ICredential) => cred.id !== credentialToDelete.id
            )
          );
        }
      })
      .catch(() => {});
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        <Column className={styles.content}>
          <h2>{'Delete credential'}</h2>
          <p>Are you sure you want to delete the credential?</p>

          <Row gap={'8px'}>
            <Button onClick={handleSubmit} variant={'primary'}>
              Delete
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

export default DeleteConfirmationModal;
