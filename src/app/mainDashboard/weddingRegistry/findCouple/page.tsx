"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

const FindCouple: React.FC = () => {
  const [accessCode, setAccessCode] = useState("");
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleFind = async () => {
    if (accessCode.trim()) {
      try {
        // Fetch the registry details by access code
        const response = await fetch(`/api/registry/findByAccessCode`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessCode }),
        });

        const data = await response.json();

        if (response.ok && data.invitationLink) {
          // Navigate to the invitation link
          router.push(data.invitationLink);
        } else {
          alert(data.error || "Invalid access code. Please try again.");
        }
      } catch (error) {
        console.error("Error finding registry:", error);
        alert("Something went wrong. Please try again.");
      }
    } else {
      alert("Please enter a valid access code.");
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>Find a registry!</p>
      <p>
        First, enter the access code from your invitation to discover the happy couple’s gift registry.
      </p>
      <p>
        Thereafter, select the gift(s) you love, and leave the rest to us! Our team will ensure that the thoughtfully
        selected are beautifully wrapped and delivered on the date chosen by the couple.
      </p>

      <input
        type="text"
        className={styles.inputBox}
        placeholder="Access code"
        value={accessCode}
        onChange={(e) => setAccessCode(e.target.value)}
      />

      <div className={styles.buttonRow}>
        <button className={styles.backButton} onClick={handleGoBack}>
          Back
        </button>
        <button className={styles.findButton} onClick={handleFind}>
          Find
        </button>
      </div>
    </div>
  );
};

export default FindCouple;
