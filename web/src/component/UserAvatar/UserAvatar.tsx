import { useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';

import './UserAvatar.css';

export function UserAvatar() {
  const { user } = useContext(AuthContext);
  if (!user) return null;

  const { firstName, lastName } = user;
  const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="d-flex align-items-center gap-2">
      <span className='user-name'>¡Hola, {firstName}!</span>
      <div className="avatar-circle">{initials}</div>
    </div>
  );
}


