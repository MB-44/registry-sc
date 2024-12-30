"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

interface Image {
  src: string;
}

interface Remark {
  guestName: string;
  productId: number;
  quantity: number;
}

interface Product {
  id: number;
  title: string;
  price: string;
  images: Image[];
  quantity: number;
  url?: string;
  remarks: Remark[];
}

interface Registry {
  _id: string;
  firstName: string;
  lastName: string;
  partnerFirstName: string;
  partnerLastName: string;
  address: string;
  address2?: string;
  city: string;
  postalCode: string;
  deliveryDate: string; 
  specialDate: string;  
  guests?: number;
  invitationLink?: string;
  accessCode?: string;
  wishlist: Product[];
  createdAt: string;    
  updatedAt: string;    
}

const InviteRegistryPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const registryId = searchParams.get("registryId");
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Guest remark form
  const [guestName, setGuestName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const fetchRegistry = async () => {
    if (!registryId) {
      setError("Registry ID not provided.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`/api/registry/${registryId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch registry details.");
      }
      const data = await response.json();
      setRegistry(data.registry);
    } catch (err: any) {
      console.error("Error fetching registry details:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistry();
    }, [registryId]);

  const handleRemark = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !selectedProductId || quantity < 1) {
      alert("Please provide your name, select a product, and enter a valid quantity.");
      return;
    }

    try {
      const response = await fetch(`/api/registry/invite/${registryId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestName, productId: selectedProductId, quantity }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to mark wishlist item.");
      }

      const data = await response.json();
      setRegistry(data.registry);
      setGuestName("");
      setSelectedProductId(null);
      setQuantity(1);
      alert("Your selection has been recorded!");
    } catch (err: any) {
      console.error("Error marking wishlist item:", err.message);
      alert(err.message);
    }
  };

  if (loading) {
    return <p className={styles.loading}>Loading registry details...</p>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  if (!registry) {
    return (
      <div className={styles.noRegistryFound}>
        <h2>Registry Not Found</h2>
        <p>Please check your link or try again later.</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Wedding Registry</h1>

      {/* Couple Info */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Couple Information</h2>
        <p>{registry.firstName} {registry.lastName} &amp; {registry.partnerFirstName} {registry.partnerLastName}</p>
      </div>

      {/* Address */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Delivery Address</h2>
        <p>
          {registry.address}
          {registry.address2 ? `, ${registry.address2}` : ""}, {registry.city}, {registry.postalCode}
        </p>
      </div>

      {/* Dates */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Important Dates</h2>
        <p><strong>Delivery Date:</strong> {formatDate(registry.deliveryDate)}</p>
        <p><strong>Special Date:</strong> {formatDate(registry.specialDate)}</p>
        <p><strong>Guests:</strong> {registry.guests || "N/A"}</p>
      </div>

      {/* Wishlist */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Wishlist</h2>
        {registry.wishlist.length > 0 ? (
          <ul className={styles.wishlist}>
            {registry.wishlist.map((product) => (
              <li key={product.id} className={styles.wishlistItem}>
                <div className={styles.productHeader}>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  <p className={styles.productPrice}>Rs {product.price}</p>
                </div>
                {product.images.length > 0 && (
                  <img 
                    src={product.images[0].src}
                    alt={product.title}
                    className={styles.productImage}
                  />
                )}
                <p className={styles.productQuantity}>Available: {product.quantity}</p>

                {product.remarks.length > 0 && (
                  <div className={styles.remarksSection}>
                    <h4>Already Taken:</h4>
                    <ul>
                      {product.remarks.map((r, i) => (
                        <li key={i}>{r.guestName} took {r.quantity}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No items in the wishlist.</p>
        )}
      </div>

      {/* Guest Mark Form */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>I Will Get...</h2>
        <form className={styles.guestForm} onSubmit={handleRemark}>
          <div className={styles.formGroup}>
            <label>Your Name:</label>
            <input 
              type="text" 
              value={guestName} 
              onChange={(e) => setGuestName(e.target.value)} 
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Select Product:</label>
            <select
              value={selectedProductId || ""}
              onChange={(e) => setSelectedProductId(Number(e.target.value))}
              required
            >
              <option value="" disabled>Select a product</option>
              {registry.wishlist.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.title} (Available: {product.quantity})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Quantity:</label>
            <input 
              type="number" 
              min={1} 
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>Mark Item</button>
        </form>
      </div>
    </div>
  );
};

export default InviteRegistryPage;
