import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import style from "./HomePage.module.css";
import api from "../services/config";

export default function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(
          "/product?page=10&limit=4&inStock=true&isActive=true"
        );
        const data = response.data ?? response;
        setProducts(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchProduct();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className={style.hero}>
        <div className={style.heroInner}>
          <h1 className={style.heroTitle}>به دنیای زیبایی خوش آمدید</h1>
          <p className={style.heroText}>
            با بهترین محصولات آرایشی و بهداشتی از برندهای معتبر جهانی
          </p>
          <a href="#products" className={style.heroButton}>
            مشاهده محصولات
          </a>
        </div>
      </section>

      {/* Categories */}
      <section className={style.section}>
        <h2 className={style.sectionTitle}>دسته بندی محصولات</h2>
        <div className={style.categoriesGrid}>
          <div className={style.categoryCard}>
            <div className={style.categoryIconWrap}>
              <i data-feather="droplet" className={style.categoryIcon}></i>
            </div>
            <h3 className={style.categoryTitle}>مراقبت پوست</h3>
          </div>
          <div className={style.categoryCard}>
            <div className={style.categoryIconWrap}>
              <i data-feather="eye" className={style.categoryIcon}></i>
            </div>
            <h3 className={style.categoryTitle}>آرایش چشم</h3>
          </div>
          <div className={style.categoryCard}>
            <div className={style.categoryIconWrap}>
              <i data-feather="smile" className={style.categoryIcon}></i>
            </div>
            <h3 className={style.categoryTitle}>آرایش لب</h3>
          </div>
          <div className={style.categoryCard}>
            <div className={style.categoryIconWrap}>
              <i data-feather="wind" className={style.categoryIcon}></i>
            </div>
            <h3 className={style.categoryTitle}>عطر و ادکلن</h3>
          </div>
        </div>
      </section>

      {/* Products */}
      <section id="products" className={style.section}>
        <div className={style.sectionHeader}>
          <h2 className={style.sectionTitle}>محصولات پرفروش</h2>
        </div>

        <div className={style.productsGrid}>
          {products.map((p) => (
            <article key={p.id} className={style.productCard}>
              <div className={style.productImageWrapper}>
                <img
                  src={p.images[0]}
                  alt={p.title || p.name}
                  className={style.productImage}
                />
              </div>
              <div className={style.productBody}>
                <h3 className={style.productTitle}>{p.name}</h3>
                <p className={style.productBrand}>برند {p.brand}</p>
                <div className={style.productFooter}>
                  <span className={style.priceText}>{p.price}</span>
                  <button className={style.addToCartBtn} aria-label="add-to-cart">
                    <i data-feather="shopping-cart" className={style.cartIcon}></i>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Special offer */}
      <section className={style.specialOffer}>
        <div className={style.specialInner}>
          <div className={style.specialContent}>
            <h2 className={style.sectionTitle}>تخفیف ویژه اولین خرید</h2>
            <p className={style.specialText}>
              با ثبت نام در سایت، از ۲۰٪ تخفیف برای اولین خرید خود بهره مند شوید
            </p>
            <Link to="/register" className={style.specialButton}>
              ثبت نام کنید
            </Link>
          </div>
          <div className={style.specialImageWrap}>
            <img
              src="http://static.photos/cosmetic/640x360/5"
              alt="Special Offer"
              className={style.specialImage}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
