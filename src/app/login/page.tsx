"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const LoginPage: React.FC = () => {
  const [countryCode] = useState("+94");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState(""); /* Added password state */
  const [otp, setOTP] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 9) {
      setPhoneNumber(value);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 9) {
      setError("Phone number must be exactly 9 digits.");
      return;
    }

    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: `${countryCode}${phoneNumber}` }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to send OTP.");
      } else {
        setMessage(data.message);
        setStep("otp");
      }
    } catch (err) {
      setError("An error occurred while sending OTP.");
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter the OTP.");
      return;
    }

    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phoneNumber: `${countryCode}${phoneNumber}`,
          otp,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to verify OTP.");
      } else {
        setMessage("Login successful.");
        localStorage.setItem("authToken", data.token);
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred while verifying OTP.");
    }
  };

  return (
    <div className={styles.container}>
      {step === "phone" && (
        <form className={styles.form} onSubmit={handleSendOTP}>
          <h2 className={styles.title}>Sign In</h2>
          <p className={styles.desc}>
            If you have already created an account, enter your phone number & verify.
          </p>
          {message && <p className={styles.success}>{message}</p>}
          <div className={styles.inputGroup}>
            {/* <label htmlFor="phone" className={styles.label}>* Phone Number</label> */}
            <div className={styles.phoneInputWrapper}>
              {/* <span className={styles.countryCode}>{countryCode}</span> */}
              <input
                type="text"
                id="phone"
                className={styles.input}
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                maxLength={9}
                required
                placeholder="Phone Number (7XXXXXXXX)"
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            {/* <label htmlFor="password" className={styles.label}>* Password</label> Added password input */}
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <button type="submit" className={styles.button}>Send OTP</button>
          <p className={styles.link}>
            Don’t have an account?{" "}
            <a href="/signup" className={styles.registerLink}>Create an Account</a>
          </p>
        </form>
      )}

      {step === "otp" && (
        <form className={styles.form} onSubmit={handleVerifyOTP}>
          <h2 className={styles.title}>Verify OTP</h2>
          <p className={styles.desc}>Enter the OTP sent to your phone number.</p>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="otp"
              className={styles.input}
              value={otp}
              onChange={(e) => setOTP(e.target.value)}
              maxLength={6}
              required
              placeholder="Enter OTP"
            />
            {message && <p className={styles.success}>{message}</p>}
          </div>
          <button type="submit" className={styles.button}>Verify</button>
          <p className={styles.link}>
            Go back to{" "}
            <a href="/login" className={styles.registerLink}>Login</a>
          </p>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
