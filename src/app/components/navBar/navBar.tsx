"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "./navBar.module.css";

const NavigationBar: React.FC = () => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMouseEnter = (link: string) => {
    setActiveDropdown(link);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <a href="/mainDashboard">
          <Image 
            src="/images/logo.png" 
            alt="logo" 
            width={110} 
            height={55} 
          />
        </a>
      </div>
      <div
        className={styles.hamburger}
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul
        className={`${styles.navLinks} ${isMobileMenuOpen ? styles.mobileVisible : ""}`}
      >
        <li
          onMouseEnter={() => handleMouseEnter("home")}
          onMouseLeave={handleMouseLeave}
        >
          <a href="/mainDashboard">Home</a>
        </li>
        <li
          onMouseEnter={() => handleMouseEnter("wedding")}
          onMouseLeave={handleMouseLeave}
        >
          <a href="/wedding-registry">Wedding Registry</a>
          {activeDropdown === "wedding" && (
            <ul className={styles.dropdown}>
              <li>
                <a href="/viewRegistry">View Registry</a>
              </li>
              <li>
                <a href="/wedding-sub2">Add Items</a>
              </li>
            </ul>
          )}
        </li>
        <li
          onMouseEnter={() => handleMouseEnter("gifting")}
          onMouseLeave={handleMouseLeave}
        >
          <a href="/gifting">Gifting</a>
          {activeDropdown === "gifting" && (
            <ul className={styles.dropdown}>
              <li>
                <a href="/gift-guide">Gift Guide</a>
              </li>
            </ul>
          )}
        </li>
        <li>
          <a href="/contact-us">Contact</a>
        </li>
        {/* CHANGED START: Added a className for Profile li to handle right-aligned dropdown */}
        <li
          className={styles.profileItem}
          onMouseEnter={() => handleMouseEnter("Profile")}
          onMouseLeave={handleMouseLeave}
        >
          <a href="/about-us">Profile</a>
          {activeDropdown === "Profile" && (
            <ul className={styles.dropdown}>
              <li>
                <a href="/editProfile">Edit Profile</a>
              </li>
              <li>
                <a href="/sign-out">Sign Out</a>
              </li>
            </ul>
          )}
        </li>
        {/* CHANGED END */}
      </ul>
      {isMobileMenuOpen && <div className={styles.overlay} onClick={toggleMobileMenu}></div>}
    </nav>
  );
};

export default NavigationBar;