"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const SignupPage: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [countryCode] = useState("+94");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOTP] = useState("");
  const [step, setStep] = useState<"register" | "otp">("register");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 9) {
      setPhoneNumber(value);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.length !== 9) {
      setError("Phone number must be exactly 9 digits.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          phoneNumber: `${countryCode}${phoneNumber}`,
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Failed to register.");
      } else {
        setMessage("OTP sent to your phone number.");
        setStep("otp");
      }
    } catch (err) {
      setError("An error occurred during registration.");
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
        setMessage("Registration successful.");
        localStorage.setItem("authToken", data.token);
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred while verifying OTP.");
    }
  };

  return (
    <div className={styles.container}>
      {step === "register" && (
        <form className={styles.form} onSubmit={handleRegister}>
          <h2 className={styles.title}>Sign Up</h2>
          <p className={styles.desc}>Create your account to get started.</p>
          {message && <p className={styles.success}>{message}</p>}
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="firstName"
              className={styles.input}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="First Name"
            />
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              id="lastName"
              className={styles.input}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Last Name"
            />
          </div>
          <div className={styles.inputGroup}>
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
            <input
              type="password"
              id="password"
              className={styles.inputPass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          <button type="submit" className={styles.button}>Register</button>
          <p className={styles.link}>
            Already have an account?{" "}
            <a href="/login" className={styles.registerLink}>Login</a>
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

export default SignupPage;
