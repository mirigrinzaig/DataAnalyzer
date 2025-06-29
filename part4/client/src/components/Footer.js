import { NavLink } from 'react-router-dom';
import { MdAlternateEmail, MdLocationPin, MdPhone } from "react-icons/md"
import './Footer.css';

const Footer = () => {
  return (
    <footer className="homepage-footer">
      <div className="footer-content">
        <NavLink
          to="https://www.google.com/maps/place/ירושלים"
          target="_blank"
          className="footer-item"
        >
          <MdLocationPin className="footer-icon" />
          <span>ירושלים</span>
        </NavLink>

        <a href="tel:+0556737092" className="footer-item">
          <MdPhone className="footer-icon" />
          <span>055-673-7092</span>
        </a>

        <a href="mailto:mirigrinzaig111@gmail.com" className="footer-item">
          <MdAlternateEmail className="footer-icon" />
          <span>mirigrinzaig111@gmail.com</span>
        </a>
      </div>
      <p className="footer-note">© כל הזכויות שמורות - מערכת ניהול מכולת</p>
    </footer>
  );
};

export default Footer;
