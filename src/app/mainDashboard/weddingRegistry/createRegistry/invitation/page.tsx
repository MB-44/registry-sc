"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

const InvitationPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const registryId = searchParams.get("registryId");
    const link = searchParams.get("link");
    const code = searchParams.get("code");
    // const { link, code } = searchParams;

    // const handleCopy = (text: string) => {
    //     navigator.clipboard.writeText(text);
    // };

    const handleCopyLink = (text: string) => {
        if (!link) {
            navigator.clipboard.writeText(text);
            alert("Link copied to clipboard");
        }
    }

    const handleCopyCode = (text: string) => {
        if (!code) {
            navigator.clipboard.writeText(text);
            alert("Code copied to clipboard");
        }
    }

    const handleGoToWishlist = () => {
        if (registryId) {
            router.push(`/mainDashboard/weddingRegistry/createRegistry/createWishlist?registryId=${registryId}`);
        }
    }

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
            <button onClick={() => handleCopyLink(link || "")} className={styles.copyButton}>
                Copy
            </button>
            </div>

            <p>
                <strong>Access Code:</strong> <span className={styles.code}>{code}</span>
            </p>
            <button onClick={() => handleCopyCode(code || "")} className={styles.copyButton}>
                Copy Access Code
            </button>
            </div>

      <button onClick={handleGoToWishlist} className={styles.button}>
        Go to Wishlist Creation
      </button>
    </div>
  );
};

export default InvitationPage;
