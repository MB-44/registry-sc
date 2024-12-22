"use client";

import React, {useState} from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const WeddingRegistry: React.FC = () => {
    const router = useRouter();

    const handleRegisterButton = () => {
        router.push("/mainDashboard/weddingRegistry/createRegistry");
    }

    const handleFindButton = () => {
        router.push("/mainDashboard/weddingRegistry/findCouple");
    }

    return(
        <div className={styles.container}>
            <div className={styles.section}>
                <p className={styles.title}>Welcome to Wedding Registry by Spa Ceylon</p>
                <p className={styles.desc}>The all-in-one wedding gift registry curated with, blah blah blah</p>

                <div className={styles.buttonContainer}>
                    <button className={styles.regButton} onClick={handleRegisterButton}>Start a Registry</button>
                    <button className={styles.findButton} onClick={handleFindButton}>Find a Couple</button>
                </div>
            </div>
        </div>
    )
}


export default WeddingRegistry;