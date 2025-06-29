import { createContext, ReactNode, useEffect, useState } from "react";

interface User {
  firstname: string;
  lastname: string;
  email: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  userRole: string | null;
  user: User | null;
  login: (token: string, role: string, user: User) => void;
  logout: () => void;
  token: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  userRole: null,
  user: null,
  login: () => { },
  logout: () => { },
  token: null
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(() => localStorage.getItem('userRole'));
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  })

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedRole && storedUser) {
      setIsLoggedIn(true);
      setUserRole(storedRole);
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    } else {
      setIsLoggedIn(false);
      setUserRole(null)
      setToken(null);
      setUser(null);
      localStorage.removeItem('userRole');
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  }, []);


  const login = (newToken: string, role: string, newUser: User) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userRole', role);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUserRole(role);
    setUser(newUser);
    setIsLoggedIn(true);
  };


  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    setToken(null);
    setUserRole(null);
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, user, login, logout, token}}>
      {children}
    </AuthContext.Provider>
  );
};
