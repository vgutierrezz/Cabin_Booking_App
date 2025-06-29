import './FooterComponent.css';
import logo from '../../assets/img/logo.png'; // Asegurate de tener la ruta correcta al logo
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

export const FooterComponent = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src={logo} alt="Logo" className="footer-logo" />
        <span>© {new Date().getFullYear()} Entre Cabañas. Todos los derechos reservados.</span>
      </div>
      <div className="footer-right">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter />
        </a>
      </div>
    </footer>
  );
};
