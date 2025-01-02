"use client";
export const dynamic = "force-dynamic";

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

const RegistryDetailsPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const registryId = searchParams.get("registryId");
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRegistryDetails = async () => {
    if (!registryId) {
      setError("Registry ID not found.");
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
      setError(err.message || "An error occurred while fetching registry details.");
    } finally {
      setLoading(false);
    }
  };

  // Poll for real-time updates (simple approach)
  useEffect(() => {
    fetchRegistryDetails();
  }, [registryId]);

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

  // Format Date
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
      <h1 className={styles.title}>Registry Details</h1>

      {/* Edit Button to navigate to Edit page */}
      <button
        className={styles.editButton}
        onClick={() =>
          router.push(`/mainDashboard/weddingRegistry/createRegistry/editRegistry?registryId=${registryId}`)
        }
      >
        Edit Registry
      </button>

      {/* Couple Info */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Couple Information</h2>
        <div className={styles.infoRow}>
          <p className={styles.infoLabel}>Name:</p>
          <p className={styles.infoValue}>
            {registry.firstName} {registry.lastName}
          </p>
        </div>
        <div className={styles.infoRow}>
          <p className={styles.infoLabel}>Partner:</p>
          <p className={styles.infoValue}>
            {registry.partnerFirstName} {registry.partnerLastName}
          </p>
        </div>
      </div>

      {/* Address */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Delivery Address</h2>
        <p className={styles.infoValue}>
          {registry.address}
          {registry.address2 ? `, ${registry.address2}` : ""}, {registry.city},{" "}
          {registry.postalCode}
        </p>
      </div>

      {/* Dates & Guests */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Important Dates</h2>
        <div className={styles.infoRow}>
          <p className={styles.infoLabel}>Delivery Date:</p>
          <p className={styles.infoValue}>{formatDate(registry.deliveryDate)}</p>
        </div>
        <div className={styles.infoRow}>
          <p className={styles.infoLabel}>Special Date:</p>
          <p className={styles.infoValue}>{formatDate(registry.specialDate)}</p>
        </div>
        <div className={styles.infoRow}>
          <p className={styles.infoLabel}>Guests:</p>
          <p className={styles.infoValue}>{registry.guests || "N/A"}</p>
        </div>
      </div>

      {/* Access */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Registry Access</h2>
        <div className={styles.infoRow}>
          <p className={styles.infoLabel}>Access Code:</p>
          <p className={styles.infoValue}>{registry.accessCode}</p>
        </div>
        {registry.invitationLink && (
          <div className={styles.infoRow}>
            <p className={styles.infoLabel}>Invitation Link:</p>
            <p className={styles.infoValue}>
              <a
                href={registry.invitationLink}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                {registry.invitationLink}
              </a>
            </p>
          </div>
        )}
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
                <p className={styles.productQuantity}>
                  Available Quantity: {product.quantity}
                </p>

                {/* Display remarks from guests */}
                {product.remarks.length > 0 && (
                  <div className={styles.remarksSection}>
                    <h4>Remarks:</h4>
                    <ul>
                      {product.remarks.map((remark, i) => (
                        <li key={i}>
                          {remark.guestName} will get {remark.quantity} {product.title}(s)
                        </li>
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
    </div>
  );
};

export default RegistryDetailsPage;
