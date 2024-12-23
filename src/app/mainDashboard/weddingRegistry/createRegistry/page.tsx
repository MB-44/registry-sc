"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles

const CreateRegistry: React.FC = () => {
  const router = useRouter();

  // State for form data **(ADDED)** 
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    partnerFirstName: "",
    partnerLastName: "",
    address: "",
    address2: "",
    city: "",
    postalCode: "",
    specialDate: null as Date | null,
    deliveryDate: null as Date | null,
    guests: 0,
  });

  const [wishlist, setwishlist] = useState([]);
  const [message, setMessage] = useState<string | null>(null); // **(ADDED)**
  const [error, setError] = useState<string | null>(null); // **(ADDED)**

  // Handle form input changes **(ADDED)**
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle DatePicker changes **(MODIFIED)**
  const handleDateChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, deliveryDate: date }));
  };

  const handleSpecialDayChange = (date: Date | null) => {
    setFormData((prev) => ({ ...prev, specialDate: date }));
  };

  // Submit form data to API **(ADDED)**
  const handleSubmit = async () => {
    setMessage(null);
    setError(null);

    console.log("Form Data being submitted:", formData);

    try {
      const response = await fetch("/api/registry/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          deliveryDate: formData.deliveryDate?.toISOString(),
          specialDate: formData.specialDate?.toISOString(),
        }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        setError(data.error || "Failed to create registry.");
      } else {
        setMessage(data.message);

        const { invitationLink, accessCode } = data;
        // router.push(`/mainDashboard/weddingRegistry/invitation?link=${encodeURIComponent(invitationLink)}&code=${encodeURIComponent(accessCode)}`);
        router.push(`/mainDashboard/weddingRegistry/createRegistry/invitation`);
      }
    } catch (err) {
      setError("An error occurred while creating the registry.");
    }
  };


  return (
    <div className={styles.pageContainer}>
      <div className={styles.tilesContainer}>
        {/* CreateRegistry Tile */}
        <div className={`${styles.tile} ${styles.createRegistryTile}`}>
          <p className={styles.title}>Welcome to Wedding Registry by Spa Ceylon</p>
          <p className={styles.startDesc}>To start off, what's your name?</p>
          <div className={styles.nameGroup}>
            {/* **MODIFIED**: Added `name` and `value` attributes */}
            <input
              type="text"
              placeholder="First"
              name="firstName"
              className={styles.inputBox}
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Last"
              name="lastName"
              className={styles.inputBox}
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>
          <p className={styles.endDesc}>And who might your better half be?</p>
          <div className={styles.nameGroup}>
            {/* **MODIFIED**: Added `name` and `value` attributes */}
            <input
              type="text"
              placeholder="First"
              name="partnerFirstName"
              className={styles.inputBox}
              value={formData.partnerFirstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              placeholder="Last"
              name="partnerLastName"
              className={styles.inputBox}
              value={formData.partnerLastName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Address Tile */}
        <div className={`${styles.tile} ${styles.addressTile}`}>
          <p className={styles.title}>Where would you like your gifts delivered?</p>
          <div className={styles.inputGroup}>
            {/* **MODIFIED**: Added `name` and `value` attributes */}
            <input
              type="text"
              placeholder="Address Line 1"
              name="address"
              className={styles.inputBox}
              value={formData.address}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Address Line 2"
              name="address2"
              className={styles.inputBox}
              value={formData.address2}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="City"
              name="city"
              className={styles.inputBox}
              value={formData.city}
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Postal Code"
              name="postalCode"
              className={styles.inputBox}
              value={formData.postalCode}
              onChange={handleChange}
            />
          </div>
          <div className={styles.dateGroup}>
            <label className={styles.label}>And When?</label>
            {/* React DatePicker */}
            <DatePicker
              selected={formData.deliveryDate}
              onChange={handleDateChange}
              minDate={new Date()} // Only allow future dates
              dateFormat="MM/dd/yyyy"
              className={styles.inputDate}
              placeholderText="mm/dd/yyyy"
            />
          </div>
        </div>

        {/* Date Tile */}
        <div className={`${styles.tile} ${styles.dateTile}`}>
          <p className={styles.desc}>When's your special day?</p>
          <div className={styles.datePicker}>
            {/* React DatePicker */}
            <DatePicker
              selected={formData.specialDate}
              onChange={handleSpecialDayChange}
              minDate={new Date()}
              dateFormat="MM/dd/yyyy"
              className={styles.inputDate}
              placeholderText="mm/dd/yyyy"
            />
          </div>
          <p className={styles.desc}>And how many guests do you hope to invite?</p>
          {/* **MODIFIED**: Added `name` and `value` attributes */}
          <input
            type="number"
            name="guests"
            placeholder="#"
            className={styles.inputBox}
            value={formData.guests}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className={styles.buttonRow}>
        <button type="button" className={styles.backButton}>
          Back
        </button>
        <button
          type="button"
          className={styles.button}
          onClick={handleSubmit} // **ADDED**
        >
          Proceed
        </button>
      </div>
      {/* Display success or error messages **(ADDED)** */}
      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default CreateRegistry;
