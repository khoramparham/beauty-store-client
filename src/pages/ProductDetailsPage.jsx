import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetailsPage.module.css";
import api from "../services/config";
import { UniversalLoader } from "../component/Loader";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const mainImageRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/product/${id}`);
        const productData = response.data ?? response;

        setProduct(productData);

        if (productData.images && productData.images.length > 0) {
          setMainImage(productData.images[0]);
        }
      } catch (error) {
        console.error("Error fetching product:", error.message);
        setError("خطا در دریافت اطلاعات محصول");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  useEffect(() => {
    if (!product) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(styles.fadeIn);
        }
      });
    }, observerOptions);

    const infoCards = document.querySelectorAll(`.${styles.infoCard}`);
    infoCards.forEach((el) => observer.observe(el));

    return () => {
      infoCards.forEach((el) => observer.unobserve(el));
    };
  }, [product]);

  const changeImage = (index, imageUrl) => {
    const imageElement = mainImageRef.current;
    if (imageElement) {
      imageElement.classList.add(styles.imageTransition);
      imageElement.style.opacity = "0";
      setTimeout(() => {
        setMainImage(imageUrl);
        imageElement.style.opacity = "1";
      }, 200);
    }
    setActiveIndex(index);
  };

  if (loading) {
    return <UniversalLoader message="در حال بارگذاری..." showProgress={true} />;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>{error}</p>
        <button className={styles.retryButton} onClick={() => window.location.reload()}>
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>محصولی یافت نشد</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR");
  };

  const thumbnails = product.images || [];
  const hasImages = thumbnails.length > 0;

  return (
    <div className={styles.productGrid}>
      {/* Images Section */}
      <div className={styles.imageSection}>
        <div className={styles.mainImageContainer}>
          <img
            ref={mainImageRef}
            src={mainImage}
            alt={product.name}
            className={styles.mainImage}
          />
        </div>

        {hasImages && thumbnails.length > 1 && (
          <div className={styles.thumbnailGrid}>
            {thumbnails.map((url, index) => (
              <button
                key={index}
                onClick={() => changeImage(index, url)}
                className={`${styles.thumbnailBtn} ${
                  activeIndex === index ? styles.thumbnailActive : ""
                }`}
              >
                <img src={url} alt={`${product.name} ${index + 1}`} />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Info Section */}
      <div className={styles.productSection}>
        <div className={styles.infoCard}>
          <h2 className={styles.productTitle}>{product.name}</h2>
          {product.brand && <p className={styles.productBrand}>{product.brand}</p>}
        </div>

        <div className={styles.badgesContainer}>
          <span
            className={`${styles.badge} ${
              product.active ? styles.badgeActive : styles.badgeInactive
            } ${styles.pulseBadge}`}
          >
            {product.active ? "فعال" : "غیرفعال"}
          </span>
          <span className={`${styles.badge} ${styles.badgeStock}`}>
            {product.inStock ? "موجود در انبار" : "ناموجود"}
          </span>
        </div>

        {(product.currentPrice || product.price) && (
          <div className={styles.priceCard}>
            <div className={styles.priceContainer}>
              <span className={styles.priceCurrent}>
                ${(product.currentPrice || product.price)?.toLocaleString()}
              </span>
              {product.originalPrice &&
                product.originalPrice > (product.currentPrice || product.price) && (
                  <>
                    <span className={styles.priceOriginal}>
                      ${product.originalPrice.toLocaleString()}
                    </span>
                    <span className={styles.discountBadge}>
                      {Math.round(
                        ((product.originalPrice -
                          (product.currentPrice || product.price)) /
                          product.originalPrice) *
                          100
                      )}
                      % تخفیف
                    </span>
                  </>
                )}
            </div>
          </div>
        )}

        <div className={styles.infoCard}>
          <div className={styles.stockInfo}>
            <div className={styles.stockDetails}>
              <div className={styles.stockText}>
                <p className={styles.stockLabel}>موجودی انبار</p>
                <p className={styles.stockValue}>
                  {(product.stockQuantity || product.stock || 0)?.toLocaleString()} واحد
                </p>
              </div>
            </div>
            <div className={styles.stockBar}>
              <div
                className={styles.stockBarFill}
                style={{
                  width: `${Math.min(
                    ((product.stockQuantity || product.stock || 0) /
                      (product.maxStock || 100)) *
                      100,
                    100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {product.description && (
          <div className={styles.infoCard}>
            <h3 className={styles.sectionTitle}>توضیحات محصول</h3>
            <p className={styles.descriptionText}>{product.description}</p>
          </div>
        )}

        <div className={styles.infoCard}>
          <h3 className={styles.sectionTitle}>اطلاعات تکمیلی</h3>
          <div className={styles.infoGrid}>
            {product._id && (
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>شناسه محصول</p>
                <p className={styles.infoValue}>{product._id}</p>
              </div>
            )}

            {(product.category?.name || product.category) && (
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>دسته بندی</p>
                <p className={styles.infoValue}>
                  {product.category?.name || product.category}
                </p>
              </div>
            )}

            {product.createdAt && (
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>تاریخ ایجاد</p>
                <p className={styles.infoValue}>{formatDate(product.createdAt)}</p>
              </div>
            )}

            {product.updatedAt && (
              <div className={styles.infoItem}>
                <p className={styles.infoLabel}>آخرین به‌روزرسانی</p>
                <p className={styles.infoValue}>{formatDate(product.updatedAt)}</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            disabled={!product.active || !product.inStock}
            className={`${styles.btn} ${
              !product.active || !product.inStock ? styles.btnDisabled : ""
            }`}
          >
            {product.active && product.inStock
              ? "افزودن به سبد خرید"
              : !product.active
              ? "محصول در حال حاضر غیرفعال است"
              : "محصول ناموجود است"}
          </button>

          <button className={`${styles.btn} ${styles.btnOutline}`}>
            افزودن به علاقه‌مندی‌ها
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
