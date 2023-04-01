import styles from './Layout.module.css';
//import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import Button from '../Button/Button';
import Row from '../FlexWrappers/Row';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { push } = useRouter();
  //const { pathname } = useRouter();

  // Prevent layout from flashing by not rendering it if we enter protected page without proper token etc
  //   if (!user.token && protectedPages.some(v => pathname.includes(v))) {
  //     return <div>{children}</div>;
  //   }

  return (
    <>
      <Row className={styles.navbar}>
        <Link
          href="/"
          style={{ color: 'var(--white)', textDecoration: 'none' }}
        >
          <h1>Password Manager</h1>
        </Link>
        <Button variant={'text'} onClick={() => push('/login')}>
          Login
        </Button>
      </Row>
      <main>{children}</main>
    </>
  );
};

export default Layout;
