import React, { useState, useEffect } from "react";
import style from "./ProductPage.module.css";
import { Search } from "react-feather";
import ProductCard from "../component/ProductCard";
import api from "../services/config";
import { UniversalLoader } from "../component/Loader";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categorys, setCategorys] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("");
  const [fav, setFav] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(
          "/product?page=1&limit=24&inStock=true&isActive=true"
        );
        const data = response.data ?? response;
        setProducts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchCategory = async () => {
      try {
        const response = await api.get("/product/categories");
        const data = response.data ?? response;
        setCategorys(data);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchCategory();
    fetchProduct();
  }, []);

  const filtered = products.filter(
    (p) =>
      (activeCat === "" || (p.category && p.category === activeCat)) &&
      (search === "" ||
        (p.name && p.name.includes(search)) ||
        (p.brand && p.brand.includes(search)))
  );
  if (products.length === 0) {
    return <UniversalLoader showProgress={false} showBars={true} />;
  }
  return (
    <div className={style.container}>
      <div className={style.header}>
        <div className={style.title}>محصولات فروشگاه</div>
        <div className={style.searchBox}>
          <Search size={18} color="#ff2d55" />
          <input
            className={style.searchInput}
            type="text"
            placeholder="جستجو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className={style.filterBar}>
        {categorys.map((cat) => (
          <button
            key={cat.value}
            className={
              cat.value === activeCat
                ? `${style.filterBtn} ${style.active}`
                : style.filterBtn
            }
            onClick={() =>
              activeCat === cat.value ? setActiveCat("") : setActiveCat(cat.value)
            }
          >
            {cat.label}
          </button>
        ))}
      </div>
      <div className={style.productsGrid}>
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} fav={fav} setFav={setFav} />
        ))}
      </div>
    </div>
  );
}

export default ProductPage;
