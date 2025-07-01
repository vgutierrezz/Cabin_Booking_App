import { NavLink, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext/AuthContext';
import { UserAvatar } from '../UserAvatar/UserAvatar';

import './HeaderComponent.css';

export const HeaderComponent = () => {
  const { isLoggedIn, logout, userRole } = useContext(AuthContext);

  const normalizedRole = userRole?.trim().toUpperCase();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
      <div className="container-fluid">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarTogglerDemo01"
          aria-controls="navbarTogglerDemo01"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
          <Link to="/home" className="navbar-brand">
            <img src="/src/assets/img/logo.png" alt="logo" className="logo" />
            <span className="logo-text align-self-end">Momentos únicos en lugares únicos</span>
          </Link>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/home"
                className={({ isActive }) =>
                  isActive ? 'nav-link active-link' : 'nav-link'
                }
              >
                Inicio
              </NavLink>
            </li>
            {normalizedRole === 'USER' && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/usuario/favoritos"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active-link' : 'nav-link'
                    }
                  >
                    Favoritos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="usuario/historial"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active-link' : 'nav-link'
                    }
                  >
                    Historial
                  </NavLink>
                </li>
              </>
            )}
            {normalizedRole === 'ADMIN' && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/administracion/listar-cabanias"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active-link' : 'nav-link'
                    }
                  >
                    Lista de Productos
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/administracion/nueva-cabania"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active-link' : 'nav-link'
                    }
                  >
                    Agregar Producto
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/administracion/listar-usuarios"
                    className={({ isActive }) =>
                      isActive ? 'nav-link active-link' : 'nav-link'
                    }
                  >
                    Lista de Usuarios
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="right-section" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isLoggedIn ? (
              <>
                <UserAvatar />
                <button className="btn btn-custom" onClick={logout}>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/register" className="btn btn-custom">
                  Crear cuenta
                </Link>
                <Link to="/auth/login" className="btn btn-custom">
                  Iniciar sesión
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
