import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  userName?: string;
  userEmail?: string;
}

const UserAvatar = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  const decoded = jwtDecode<JwtPayload>(token);
  const name = decoded.userName || decoded.userEmail || '';
  const initials = name
    .split(' ')
    .map(w => w[0]?.toUpperCase())
    .join('')
    .slice(0, 2);

  return (
    <div className="d-flex align-items-center gap-2">
      <div className="avatar-circle">{initials}</div>
      <span>{name}</span>
    </div>
  );
};
