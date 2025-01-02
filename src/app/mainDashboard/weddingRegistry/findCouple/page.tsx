"use client";

import React, {useState} from "react";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { access } from "fs";

const FindCouple: React.FC = () => {
    const [accessCode, setAccessCode] = useState<string>("");
    const router = useRouter();

    const handleGoBack = () => {
        router.back();
    };

    const handleFind = () => {
        if (accessCode.trim()) {
            router.push(`/invite/${accessCode}`);
        } else {
            alert("please enter a valid access code.")
        }
    };   

    return (
        <div className={styles.container}>
            <p className={styles.title}>Find a registry!</p>
            <p>First, enter the access code from your invitation to discover the happy couple’s gift registry.</p>
            <p>Thereafter, select the gift(s) you love, and leave the rest to us! Our team will ensure that the thoughtfully selected are beautifully wrapped and delivered on the date chosen by the couple</p>
            
            <input 
                type="text" 
                className={styles.inputBox} 
                placeholder="Access code"
                onChange={(e) => setAccessCode(e.target.value)}
            />

            <div className={styles.buttonRow}>
                <button className={styles.backButton} onClick={handleGoBack}> Back </button>
                <button className={styles.findButton} onClick={handleFind}>Find</button>
            </div>
        </div>
    )
}

export  default FindCouple;