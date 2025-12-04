import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import style from "./Navbar.module.css";
import { Search, Heart, ShoppingCart, User, Menu, Home } from "react-feather";
export default function Navbar() {
  const [cartCount] = useState(0);

  return (
    <>
      <nav className={style.nav}>
        <Link to="/" className={style.logo}>
          <img
            src="http://static.photos/cosmetic/200x200/1"
            alt="logo"
            className={style.logoImage}
          />
          گلمور گلو
        </Link>

        <div className={style.desktopMenu}>
          <Link to="/" className={style.menuLink}>
            خانه
          </Link>
          <Link to="/product" className={style.menuLink}>
            محصولات
          </Link>
          <Link to="/categories" className={style.menuLink}>
            دسته‌بندی‌ها
          </Link>
          <Link to="/blog" className={style.menuLink}>
            وبلاگ
          </Link>
        </div>

        <div className={style.iconsContainer}>
          <NavLink to="/search" className={style.icon}>
            <Search color="#374151" />
          </NavLink>
          <NavLink to="/wishlist" className={style.icon}>
            <Heart color="#374151" />
          </NavLink>
          <NavLink to="/cart" className={style.cartContainer}>
            <ShoppingCart color="#3d3751ff" />
            {cartCount > 0 && <span className={style.cartCount}>{cartCount}</span>}
          </NavLink>
          <NavLink to="/login" className={style.icon}>
            <User color="#374151" />
          </NavLink>
        </div>
      </nav>

      {/* منوی موبایل همیشه نمایش داده می‌شود */}
      <div className={style.mobileMenu}>
        <nav className={style.mobileMenuNav}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? `${style.mobileMenuItem} ${style.active}` : style.mobileMenuItem
            }
          >
            <span className={style.mobileMenuIcon}>
              <Home />
            </span>
            خانه
          </NavLink>
          <NavLink
            to="/product"
            className={({ isActive }) =>
              isActive ? `${style.mobileMenuItem} ${style.active}` : style.mobileMenuItem
            }
          >
            <span className={style.mobileMenuIcon}>
              <ShoppingCart />
            </span>
            محصولات
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) =>
              isActive ? `${style.mobileMenuItem} ${style.active}` : style.mobileMenuItem
            }
          >
            <span className={style.mobileMenuIcon}>
              <Menu />
            </span>
            دسته‌بندی‌ها
          </NavLink>
          <NavLink
            to="/blog"
            className={({ isActive }) =>
              isActive ? `${style.mobileMenuItem} ${style.active}` : style.mobileMenuItem
            }
          >
            <span className={style.mobileMenuIcon}>
              <Search />
            </span>
            وبلاگ
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              isActive ? `${style.mobileMenuItem} ${style.active}` : style.mobileMenuItem
            }
          >
            <span className={style.mobileMenuIcon}>
              <User />
            </span>
            درباره ما
          </NavLink>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              isActive ? `${style.mobileMenuItem} ${style.active}` : style.mobileMenuItem
            }
          >
            <span className={style.mobileMenuIcon}>
              <Heart />
            </span>
            تماس با ما
          </NavLink>
        </nav>
      </div>
    </>
  );
}
