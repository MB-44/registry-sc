"use client";

import React, {useState} from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const IntroPage: React.FC = () => {
  const router = useRouter();

  const handleLoginButton = () => {
    router.push("/login");
  }

  const handleSignUpButton = () => {
    router.push("/sign-up");
  }


  return (
    <div className={styles.container}>
        <div className={styles.left}>
            <h1 className={styles.title}>Wedding Registry by Spa Ceylon</h1>
            <p className={styles.description}> Join us as we embark on a new adventure together. Here, we'll share our stories, celebrate milestones, and connect with you in meaningful ways. Dive into our world and discover what makes us tick—whether it's our latest projects, personal insights, or just snippets of daily life. Let's make this journey memorable together!</p>
            
            <div className={styles.buttonRow}>
              <button className={styles.loginButton} onClick={handleLoginButton}> Login </button>
              <button className={styles.regButton} onClick={handleSignUpButton}> Sign Up </button>
            </div>
        </div>
        <div className={styles.right}>
          <img
            alt="Holiday Illustration"
            className={styles.vector}
          />
        </div>
    </div>
    )
}

export default IntroPage;