import styles from './Layout.module.css';
//import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import Row from '../FlexWrappers/Row';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <>
      <Row className={styles.navbar}>
        <Link
          href="/"
          style={{ color: 'var(--white)', textDecoration: 'none' }}
        >
          <h1>Password Manager</h1>
        </Link>
      </Row>
      <main>{children}</main>
    </>
  );
};

export default Layout;
