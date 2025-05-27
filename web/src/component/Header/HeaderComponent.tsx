import './HeaderComponent.css'
import imgLogo from './img/logo.png'

export const HeaderComponent = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
                <div className="container-fluid">
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
                        <a className="navbar-brand" href="#">
                            <img src={imgLogo} alt="logo" className="logo" />
                            <span className="logo-text align-self-end">Momentos únicos en lugares únicos</span>
                        </a>
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <a className="nav-link active" aria-current="page" href="#">Home</a>
                            </li>
                        </ul>
                        <div className="right-section">
                            <button className="btn">Crear cuenta</button>
                            <button className="btn">Iniciar sesión</button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};