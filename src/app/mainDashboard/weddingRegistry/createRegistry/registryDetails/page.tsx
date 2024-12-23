"use client";

import React, { useEffect, useState } from "react";
import styles from "./page.module.css";

interface Product {
  id: number;
  title: string;
  price: string;
  images: { src: string }[];
  quantity: number;
  url?: string;
}

interface RegistryDetails {
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
  wishlist: Product[];
}

const RegistryDetailsPage: React.FC = () => {
  const [registryDetails, setRegistryDetails] = useState<RegistryDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegistryDetails = async () => {
      try {
        const response = await fetch("/api/registry/details"); // Adjust the API route as needed
        
        if (!response.ok) {
          throw new Error("Failed to fetch registry details");
        }
        const data = await response.json();
        setRegistryDetails(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistryDetails();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!registryDetails) return <p>No registry found.</p>;

  return (
    <div className={styles.container}>
      <h1>Registry Details</h1>
      <div className={styles.section}>
        <h2>Couple Details</h2>
        <p>
          <strong>Name:</strong> {registryDetails.firstName}{" "}
          {registryDetails.lastName}
        </p>
        <p>
          <strong>Partner:</strong> {registryDetails.partnerFirstName}{" "}
          {registryDetails.partnerLastName}
        </p>
      </div>
      <div className={styles.section}>
        <h2>Address</h2>
        <p>
          <strong>Address Line 1:</strong> {registryDetails.address}
        </p>
        {registryDetails.address2 && (
          <p>
            <strong>Address Line 2:</strong> {registryDetails.address2}
          </p>
        )}
        <p>
          <strong>City:</strong> {registryDetails.city}
        </p>
        <p>
          <strong>Postal Code:</strong> {registryDetails.postalCode}
        </p>
      </div>
      <div className={styles.section}>
        <h2>Special Dates</h2>
        <p>
          <strong>Special Day:</strong>{" "}
          {new Date(registryDetails.specialDate).toLocaleDateString()}
        </p>
        <p>
          <strong>Delivery Date:</strong>{" "}
          {new Date(registryDetails.deliveryDate).toLocaleDateString()}
        </p>
      </div>
      <div className={styles.section}>
        <h2>Guest Details</h2>
        <p>
          <strong>Number of Guests:</strong> {registryDetails.guests || "N/A"}
        </p>
      </div>
      <div className={styles.section}>
        <h2>Wishlist</h2>
        {registryDetails.wishlist.length > 0 ? (
          <ul className={styles.wishlist}>
            {registryDetails.wishlist.map((item) => (
              <li key={item.id} className={styles.wishlistItem}>
                <div className={styles.itemDetails}>
                  <p>
                    <strong>{item.title}</strong>
                  </p>
                  <p>Price: {item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  {item.url && (
                    <p>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        View Product
                      </a>
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No wishlist items added.</p>
        )}
      </div>
    </div>
  );
};

export default RegistryDetailsPage;
