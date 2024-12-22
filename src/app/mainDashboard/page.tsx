"use client";

import React, {useState} from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

const MainDashboard: React.FC = () => {
    const router = useRouter();

    const handleButton = () => {
        router.push("mainDashboard/weddingRegistry");
    }

    return(
        <div className={styles.container}>
            <div className={styles.card}>
                <p className={styles.desc}>The all-in-one wedding gift registry curated with Sri Lanka's finest products & experience</p>
                <button className={styles.cardButton} onClick={handleButton}>Wedding Registry</button>
            </div>
        </div>
    )
}

export default MainDashboard;