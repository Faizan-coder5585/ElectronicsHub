'use client';

import { useSelector } from 'react-redux';

const SomeComponent = () => {
  const user = useSelector((state) => state.auth.user);

  return <div>{user ? `Hello, ${user.name}` : 'Please log in'}</div>;
};

export default SomeComponent;
