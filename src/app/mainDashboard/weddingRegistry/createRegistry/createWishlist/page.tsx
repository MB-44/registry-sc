"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

interface Product {
  id: number;
  title: string;
  price: string;
  images: { src: string }[];
  quantity: number;
}

interface Collection {
  id: number;
  title: string;
  products: Product[];
}

const COLLECTIONS = [
  { id: 463110701355, title: "Spa Rituals" },
  { id: 458625777963, title: "E-Gift Cards" },
  { id: 458624762155, title: "Gift Cards" },
  { id: 463729623339, title: "Hair Care Discovery Set" },
  { id: 458625188139, title: "Skin Care Sets" },
  { id: 463444345131, title: "Trio Sets" },
  { id: 458615062827, title: "Home Spa Sets" },
  { id: 463497789739, title: "Body Treatment Starter Sets" },
  { id: 463729262891, title: "Mini Treats" },
  { id: 463729361195, title: "Luxury Soap Collection" },
  { id: 463444508971, title: "Home Aroma" },
];

let customIdCounter = 100000; // For unique IDs for custom products

const WishlistPage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const scrollref = useRef<HTMLDivElement | null>(null);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [customProductName, setCustomProductName] = useState("");
  const [customProductURL, setCustomProductURL] = useState("");

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const fetchedCollections: Collection[] = await Promise.all(
          COLLECTIONS.map(async (collection) => {
            const response = await fetch(`/api/categories?collectionId=${collection.id}`);
            if (!response.ok) {
              throw new Error(`Failed to fetch products for collection ${collection.id}`);
            }
            const data = await response.json();
            return {
              id: collection.id,
              title: collection.title,
              products: (data.products || []).map((product: any) => ({
                id: product.id,
                title: product.title,
                price: product.variants?.[0]?.price || "N/A",
                images: product.images || [],
                quantity: 1,
              })),
            };
          })
        );
        setCollections(fetchedCollections);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollref.current) {
        scrollref.current.scrollLeft += 2;
        if (
          scrollref.current.scrollLeft + scrollref.current.offsetWidth >=
          scrollref.current.scrollWidth
        ) {
          scrollref.current.scrollLeft = 0;
        }
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleAddToWishlist = (product: Product) => {
    setWishlist((prev) => {
      const existingProduct = prev.find((item) => item.id === product.id);
      if (existingProduct) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + product.quantity } : item
        );
      }
      return [...prev, { ...product }];
    });
  };

  const handleIncrement = (productId: number) => {
    setCollections((prev) =>
      prev.map((collection) => {
        return {
          ...collection,
          products: collection.products.map((product) =>
            product.id === productId
              ? { ...product, quantity: product.quantity + 1 }
              : product
          ),
        };
      })
    );
    setWishlist((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (productId: number) => {
    setCollections((prev) =>
      prev.map((collection) => {
        return {
          ...collection,
          products: collection.products.map((product) =>
            product.id === productId && product.quantity > 1
              ? { ...product, quantity: product.quantity - 1 }
              : product
          ),
        };
      })
    );
    setWishlist((prev) =>
      prev.map((item) =>
        item.id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemoveFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  };

  const handleAddCustomProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customProductName.trim()) return;
    const newProduct: Product = {
      id: customIdCounter++,
      title: customProductName,
      price: "N/A",
      images: customProductURL ? [{ src: customProductURL }] : [],
      quantity: 1,
    };
    handleAddToWishlist(newProduct);
    setCustomProductName("");
    setCustomProductURL("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1 className={styles.title}>Wishlist Page</h1>
        <div className={styles.cartIconWrapper} onClick={() => setShowCartPreview(true)}>
          <svg
            className={styles.cartIcon}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 2.25h1.5l1.72 9.29a2.25 2.25 0 002.21 1.96h8.58a2.25 2.25 0 002.21-1.96l1.02-5.82H6.195"
            />
          </svg>
          {wishlist.length > 0 && (
            <div className={styles.cartBadge}>{wishlist.length}</div>
          )}
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && !error && collections.length > 0 && (
        <div className={styles.horizontalScroll} ref={scrollref}>
          {collections.map((collection) => (
            <div
              key={collection.id}
              className={styles.tile}
              onClick={() => setSelectedCollection(collection)}
            >
              <h2 className={styles.tileTitle}>{collection.title}</h2>
            </div>
          ))}
        </div>
      )}

      <div className={styles.addCustomProductSection}>
        <h3>Add a Custom Product</h3>
        <form onSubmit={handleAddCustomProduct} className={styles.customForm}>
          <input
            type="text"
            placeholder="Product Name"
            value={customProductName}
            onChange={(e) => setCustomProductName(e.target.value)}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Product Image URL (optional)"
            value={customProductURL}
            onChange={(e) => setCustomProductURL(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Add Product
          </button>
        </form>
      </div>

      {selectedCollection && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button className={styles.closeButton} onClick={() => setSelectedCollection(null)}>
              &times;
            </button>
            <h2>{selectedCollection.title}</h2>
            <div className={styles.grid}>
              {selectedCollection.products.map((product) => (
                <div key={product.id} className={styles.card}>
                  <h3 className={styles.productTitle}>{product.title}</h3>
                  {product.images.length > 0 && (
                    <img
                      src={product.images[0].src}
                      alt={product.title}
                      className={styles.image}
                    />
                  )}
                  <p className={styles.productPrice}>Rs {product.price}</p>
                  <div className={styles.quantityControl}>
                    <button
                      className={styles.decrementButton}
                      onClick={() => handleDecrement(product.id)}
                    >
                      -
                    </button>
                    <span className={styles.quantity}>{product.quantity}</span>
                    <button
                      className={styles.incrementButton}
                      onClick={() => handleIncrement(product.id)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={styles.button}
                    onClick={() => handleAddToWishlist(product)}
                  >
                    Add to Wishlist
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCartPreview && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={() => setShowCartPreview(false)}
            >
              &times;
            </button>
            <h2>Your Wishlist</h2>
            {wishlist.length > 0 ? (
              <ul className={styles.wishlistPreview}>
                {wishlist.map((product) => (
                  <li key={product.id} className={styles.wishlistItem}>
                    <span>{product.title}</span>
                    <span className={styles.productPrice}>
                      {product.price !== "N/A" ? `Rs ${product.price}` : "No Price"}
                    </span>
                    <span>Quantity: {product.quantity}</span>
                    <button
                      className={styles.removeButton}
                      onClick={() => handleRemoveFromWishlist(product.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Your wishlist is empty.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
