"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./page.module.css";

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
  wishlist: any[];
  createdAt: string;
  updatedAt: string;
}

const EditRegistryPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const registryId = searchParams.get("registryId");
  const [registry, setRegistry] = useState<Registry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Registry>>({});

  useEffect(() => {
    const fetchRegistry = async () => {
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
          throw new Error(errorData.error || "Failed to fetch registry.");
        }

        const data = await response.json();
        setRegistry(data.registry);
        setFormData(data.registry);
      } catch (err: any) {
        console.error("Error fetching registry:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistry();
  }, [registryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit updates to POST /api/registry/[id]
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registryId) return;

    try {
      const response = await fetch(`/api/registry/${registryId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update registry.");
      }

      // Once updated, navigate back to registry details
      router.push(`/mainDashboard/weddingRegistry/createRegistry/registryDetails?registryId=${registryId}`);
    } catch (err: any) {
      console.error("Error updating registry:", err.message);
      setError(err.message);
    }
  };

  if (loading) return <p className={styles.loading}>Loading registry...</p>;
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

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Edit Registry</h1>
      <form className={styles.form} onSubmit={handleUpdate}>

        <div className={styles.formGroup}>
          <label htmlFor="firstName">First Name</label>
          <input 
            type="text" 
            name="firstName"
            value={formData.firstName || ""} 
            onChange={handleChange}
            required 
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastName">Last Name</label>
          <input 
            type="text"
            name="lastName"
            value={formData.lastName || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="partnerFirstName">Partner's First Name</label>
          <input
            type="text"
            name="partnerFirstName"
            value={formData.partnerFirstName || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="partnerLastName">Partner's Last Name</label>
          <input
            type="text"
            name="partnerLastName"
            value={formData.partnerLastName || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address2">Address 2</label>
          <input
            type="text"
            name="address2"
            value={formData.address2 || ""}
            onChange={handleChange}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="city">City</label>
          <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="deliveryDate">Delivery Date</label>
          <input
            type="date"
            name="deliveryDate"
            value={formData.deliveryDate ? formData.deliveryDate.split("T")[0] : ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="specialDate">Special Date</label>
          <input
            type="date"
            name="specialDate"
            value={formData.specialDate ? formData.specialDate.split("T")[0] : ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="guests">Guests</label>
          <input
            type="number"
            name="guests"
            value={String(formData.guests || 0)}
            onChange={handleChange}
            min={0}
          />
        </div>

        <button type="submit" className={styles.saveButton}>Save</button>
      </form>
    </div>
  );
};

export default EditRegistryPage;
