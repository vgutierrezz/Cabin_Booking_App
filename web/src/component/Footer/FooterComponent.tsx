import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import './FooterComponent.css';

export const FooterComponent = () => {
  return (
    <footer className="footer">
      <div className="footer-left">
        <img src="/src/assets/img/logo.png" alt="Logo" className="footer-logo" />
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
