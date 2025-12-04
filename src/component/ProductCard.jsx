import React from "react";
import style from "./ProductCard.module.css";
import { Heart, ShoppingCart } from "react-feather";
import { Link, useNavigate } from "react-router-dom";

const ProductCard = ({ product, fav, setFav }) => {
  const id = product._id || product.id;
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };
  return (
    <div className={style.productCard} onClick={handleCardClick}>
      <div className={style.productImageWrap}>
        <img
          src={product.images?.[0] || product.image}
          alt={product.name || product.title}
          className={style.productImage}
        />
        <button
          className={fav.includes(id) ? `${style.favBtn} ${style.active}` : style.favBtn}
          onClick={() =>
            setFav(fav.includes(id) ? fav.filter((f) => f !== id) : [...fav, id])
          }
          aria-label="افزودن به علاقه‌مندی"
        >
          <Heart size={18} />
        </button>
      </div>
      <div className={style.productBody}>
        <div className={style.productTitle}>{product.name || product.title}</div>
        <div className={style.productBrand}>برند {product.brand}</div>
        <div className={style.productFooter}>
          <span className={style.price}>{product.price}</span>
          <button className={style.addToCartBtn} aria-label="افزودن به سبد">
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
