"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

interface Image {
  src: string;
}

interface Product {
  id: number;
  title: string;
  price: string;
  images: Image[];
  quantity: number;
  url?: string;
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

  useEffect(() => {
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

    fetchRegistryDetails();
  }, [registryId]);

  if (loading) return <p>Loading registry details...</p>;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!registry) return <p>No registry found.</p>;

  return (
    <div className={styles.page}>
      <h1>Registry Details</h1>
      <p><strong>Name:</strong> {registry.firstName} {registry.lastName}</p>
      <p><strong>Partner:</strong> {registry.partnerFirstName} {registry.partnerLastName}</p>
      <p><strong>Address:</strong> {registry.address} {registry.address2 ? `, ${registry.address2}` : ""}, {registry.city}, {registry.postalCode}</p>
      <p><strong>Delivery Date:</strong> {new Date(registry.deliveryDate).toLocaleDateString()}</p>
      <p><strong>Special Date:</strong> {new Date(registry.specialDate).toLocaleDateString()}</p>
      <p><strong>Guests:</strong> {registry.guests}</p>
      <p><strong>Access Code:</strong> {registry.accessCode}</p>
      <p><strong>Invitation Link:</strong> <a href={registry.invitationLink} target="_blank" rel="noopener noreferrer">{registry.invitationLink}</a></p>

      <h2>Wishlist</h2>
      {registry.wishlist.length > 0 ? (
        <ul className={styles.wishlist}>
          {registry.wishlist.map((product) => (
            <li key={product.id} className={styles.wishlistItem}>
              <h3>{product.title}</h3>
              {product.images.length > 0 && (
                <img src={product.images[0].src} alt={product.title} className={styles.productImage} />
              )}
              <p>Price: Rs {product.price}</p>
              <p>Quantity: {product.quantity}</p>
              {product.url && (
                <p>URL: <a href={product.url} target="_blank" rel="noopener noreferrer">{product.url}</a></p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in the wishlist.</p>
      )}
    </div>
  );
};

export default RegistryDetailsPage;
