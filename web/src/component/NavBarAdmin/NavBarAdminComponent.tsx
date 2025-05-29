import { NavLink } from 'react-router-dom';
import './NavBarAdminComponent.css';
import imgLogo from './img/logo.png';

export const NavBarAdminComponent = () => {
    return (
            <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top custom-navbar">
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
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <a className="navbar-brand d-flex align-items-center" href="#">
                            <img src={imgLogo} alt="logo" className="logo me-2" />
                            <span className="logo-text">Momentos únicos en lugares únicos</span>
                        </a>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <NavLink 
                                    to={"/home"}
                                    className={({ isActive}) => isActive ? "nav-link active-link" : "nav-link"}
                                >
                                    Inicio
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink 
                                    to={"/administracion/listar-cabanias"}
                                    className={({ isActive}) => isActive ? "nav-link active-link" : "nav-link"}
                                >
                                    Panel de Administración
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink 
                                    to={"/administracion/nueva-cabania"}
                                    className={({ isActive}) => isActive ? "nav-link active-link" : "nav-link"}
                                >
                                    Nueva Cabaña
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
    );
};
