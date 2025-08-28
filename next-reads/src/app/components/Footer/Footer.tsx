"use client"
import Link from 'next/link';
import { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupText, setPopupText] = useState('');

  const handleIconClick = (network: string) => {
    setPopupText(`${network} to be added... :)`);
    setPopupVisible(true);
    setTimeout(() => setPopupVisible(false), 2000);
  };

  return (
    <footer className="bg-[#F9F3EE] py-6 px-8 mt-12 relative">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <p className="text-sm text-[#593E2E] mb-4 md:mb-0">
          &copy; {new Date().getFullYear()} NextReads. All rights reserved.
        </p>
        <ul className="flex space-x-6 text-[#593E2E] text-base font-semibold">
          <li>
            <Link href="/about" className="hover:underline">About Us</Link>
          </li>
          <li>
            <Link href="/contact" className="hover:underline">Contact</Link>
          </li>
          <li>
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          </li>
        </ul>
        <div className="flex space-x-4 text-[#593E2E] mt-4 md:mt-0">
          <button
            aria-label="Facebook"
            onClick={() => handleIconClick('Facebook')}
            className="hover:text-[#8C6954] transition duration-300"
          >
            <FaFacebookF size={24} />
          </button>
          <button
            aria-label="Twitter"
            onClick={() => handleIconClick('Twitter')}
            className="hover:text-[#8C6954] transition duration-300"
          >
            <FaTwitter size={24} />
          </button>
          <button
            aria-label="Instagram"
            onClick={() => handleIconClick('Instagram')}
            className="hover:text-[#8C6954] transition duration-300"
          >
            <FaInstagram size={24} />
          </button>
        </div>
      </div>
      {popupVisible && (
        <div className="absolute bottom-16 right-8 bg-[#593E2E] text-white px-4 py-2 rounded shadow-lg animate-fade-in">
          {popupText}
        </div>
      )}
    </footer>
  );
};

export default Footer;
