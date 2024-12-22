"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./page.module.css";

const ViewRegistryPage: React.FC = () => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const uniqueCode = searchParams.get("code");

  useEffect(() => {
    const fetchRegistry = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/registry/getRegistry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ uniqueCode }),
        });
        const data = await response.json();
        if (data.success) setWishlist(data.registry.wishlist || []);
        else setError(data.message);
      } catch (error) {
        setError("Failed to load registry.");
      } finally {
        setLoading(false);
      }
    };

    if (uniqueCode) fetchRegistry();
  }, [uniqueCode]);

  const markAsPurchased = async (productId: string) => {
    try {
      const response = await fetch("/api/registry/updateWishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uniqueCode, productId }),
      });
      const data = await response.json();
      if (data.success) {
        setWishlist((prev) =>
          prev.map((item) => (item.id === productId ? { ...item, purchased: true } : item))
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to mark item as purchased.");
    }
  };

  return (
    <div className={styles.container}>
      <h1>Registry Wishlist</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <ul>
          {wishlist.map((item) => (
            <li key={item.id}>
              <p>{item.title}</p>
              <button disabled={item.purchased} onClick={() => markAsPurchased(item.id)}>
                {item.purchased ? "Already Purchased" : "Mark as Purchased"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ViewRegistryPage;
