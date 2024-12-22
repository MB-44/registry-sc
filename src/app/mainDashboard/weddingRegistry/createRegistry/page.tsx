"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles

const AllInOnePage: React.FC = () => {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [specialDay, setSpecialDay] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleSpecialDayChange = (date: Date | null) => {
    setSpecialDay(date);
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.tilesContainer}>

        {/* CreateRegistry Tile */}
        <div className={`${styles.tile} ${styles.createRegistryTile}`}>
          <p className={styles.title}>Welcome to Wedding Registry by Spa Ceylon</p>
          <p className={styles.startDesc}>To start off, what's your name?</p>
          <div className={styles.nameGroup}>
            <input type="text" placeholder="First" className={styles.inputBox} required />
            <input type="text" placeholder="Last" className={styles.inputBox} />
          </div>
          <p className={styles.endDesc}>And who might your better half be?</p>
          <div className={styles.nameGroup}>
            <input type="text" placeholder="First" className={styles.inputBox} required />
            <input type="text" placeholder="Last" className={styles.inputBox} />
          </div>
        </div>

        {/* Address Tile */}
        <div className={`${styles.tile} ${styles.addressTile}`}>
          <p className={styles.title}>Where would you like your gifts delivered?</p>
          <div className={styles.inputGroup}>
            <input type="text" placeholder="Address Line 1" className={styles.inputBox} />
            <input type="text" placeholder="Address Line 2" className={styles.inputBox} />
            <input type="text" placeholder="City" className={styles.inputBox} />
            <input type="text" placeholder="Postal Code" className={styles.inputBox} />
          </div>
          <div className={styles.dateGroup}>
            <label className={styles.label}>And When?</label>
            {/* React DatePicker */}
            <DatePicker
              selected={selectedDate}
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
              selected={specialDay}
              onChange={handleSpecialDayChange}
              minDate={new Date()} 
              dateFormat="MM/dd/yyyy"
              className={styles.inputDate}
              placeholderText="mm/dd/yyyy"
            />
          </div>
          <p className={styles.desc}>And how many guests do you hope to invite?</p>
          <input type="number" placeholder="#" className={styles.inputBox} />
        </div>

      </div>
      <div className={styles.buttonRow}>
        <button type="button" className={styles.backButton}>Back</button>
        <button type="button" className={styles.button}>Proceed</button>
      </div>
    </div>
  );
};

export default AllInOnePage;
