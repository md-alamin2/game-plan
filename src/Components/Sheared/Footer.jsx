import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
} from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";
import Logo from "../Logo/Logo";
import { NavLink } from "react-router";

const Footer = () => {
    const active = "font-semibold text-white";
    const links = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? active : "font-medium")}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/courts"
          className={({ isActive }) => (isActive ? active : "font-medium")}
        >
          Courts
        </NavLink>
      </li>
    </>
  );
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Logo></Logo>
            <p className="text-gray-300">
              Your premier destination for sports and fitness. Join our
              community and elevate your game to the next level.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Quick Links</h2>
            <ul className="space-y-2">
              {links}
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Contact Info</h2>
              <address className="not-italic space-y-1">
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-primary" />
                  <div>
                    <p>123 Sports Avenue</p>
                    <p>Savar, Dahaka, Bangaldesh</p>
                  </div>
                </div>
                <p className="flex items-center gap-2">
                  <FaPhone className="text-primary" /> +1 (555) 123-4567
                </p>
                <p className="flex items-center gap-2">
                  <MdOutlineEmail className="text-primary" />{" "}
                  info@elitesportsclub.com
                </p>
              </address>
            </div>
          </div>

          {/* Social Media Links */}
          <div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Follow Us</h2>
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/programmingHero"
                  target="_blank"
                  className="text-2xl hover:text-primary transition-colors"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://www.instagram.com/programminghero/"
                  target="_blank"
                  className="text-2xl hover:text-primary transition-colors"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://www.youtube.com/@ProgrammingHeroCommunity"
                  target="_blank"
                  className="text-2xl hover:text-primary transition-colors"
                >
                  <FaYoutube />
                </a>
              </div>
            </div>

            <div className="pt-4">
              <p>Mon - Fri: 6:00 AM - 10:00 PM</p>
              <p>Sat - Sun: 7:00 AM - 9:00 PM</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>
            &copy; {new Date().getFullYear()} Elite Sports Club. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
