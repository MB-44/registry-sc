"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

const InvitationPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const link = searchParams.get("link");
    const code = searchParams.get("code");
    // const { link, code } = searchParams;

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // alert("Copied to clipboard!");
    };

    return (
        <div className={styles.container}>
            <h2>Share Your Invitation</h2>
            <p>Invite your guests to your registry using the details below:</p>

            <div className={styles.card}>
            <p>
                <strong>Invitation Link:</strong>
            </p>
            <div className={styles.copyWrapper}>
            <input type="text" value={link || ""} readOnly className={styles.input} />
            <button onClick={() => handleCopy(link || "")} className={styles.copyButton}>
                Copy
            </button>
            </div>

            <p>
                <strong>Access Code:</strong> <span className={styles.code}>{code}</span>
            </p>
            <button onClick={() => handleCopy(code || "")} className={styles.copyButton}>
                Copy Access Code
            </button>
            </div>

      <button onClick={() => router.push("/mainDashboard/weddingRegistry/createRegistry/createWishlist")} className={styles.button}>
        Go to Wishlist Creation
      </button>
    </div>
  );
};

export default InvitationPage;
