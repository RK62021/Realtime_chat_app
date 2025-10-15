// src/components/Layout.jsx
import UsernameModal from './Usernamesetup.jsx';
import { useSelector } from 'react-redux';

export default function Layout({ children }) {
  const { needSetup } = useSelector(state => state.auth);

  return (
    <>
      {children}
      {needSetup && <UsernameModal />}
    </>
  );
}
