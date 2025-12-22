import React, { useState, useEffect, useCallback, useMemo } from "react";
import style from "./ProductPage.module.css";
import { Search } from "react-feather";
import ProductCard from "../component/ProductCard";
import api from "../services/config";
import { UniversalLoader } from "../component/Loader";
import Pagination from "../component/Pagination";
const INITIAL_PAGE = 1;
const PAGE_LIMIT = 24;
const DEFAULT_FILTERS = {
  inStock: true,
  isActive: true,
};

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    page: INITIAL_PAGE,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  // const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async (page = INITIAL_PAGE, category = "") => {
    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page,
        limit: PAGE_LIMIT,
        ...DEFAULT_FILTERS,
        ...(category && { category }),
      };

      const response = await api.get("/product", { params });

      setPagination(
        response.pagination || {
          page,
          limit: PAGE_LIMIT,
          total: response.data?.length || 0,
          totalPages: 1,
          hasNext: false,
          hasPrev: page > 1,
        }
      );

      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("خطا در دریافت محصولات:", error.message);
      setError("خطا در بارگذاری محصولات. لطفاً دوباره تلاش کنید.");
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await api.get("/product/categories");
      const data = response.data ?? response;
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("خطا در دریافت دسته‌بندی‌ها:", error.message);
      setCategories([]);
    }
  }, []);
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    if (search.trim()) {
      const timerId = setTimeout(() => {
        fetchProducts(INITIAL_PAGE, activeCategory);
      }, 500);

      return () => clearTimeout(timerId);
    } else {
      fetchProducts(INITIAL_PAGE, activeCategory);
    }
  }, [search, activeCategory, fetchProducts]);

  const handlePageChange = useCallback(
    (newPage) => {
      fetchProducts(newPage, activeCategory);
    },
    [activeCategory, fetchProducts]
  );

  const handleCategoryChange = useCallback(
    (categoryValue) => {
      const newCategory = activeCategory === categoryValue ? "" : categoryValue;
      setActiveCategory(newCategory);
      if (newCategory !== activeCategory) {
        fetchProducts(INITIAL_PAGE, newCategory);
      }
    },
    [activeCategory, fetchProducts]
  );

  const handleSearchChange = useCallback((e) => {
    setSearch(e.target.value);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!search.trim()) return products;

    const searchTerm = search.toLowerCase();
    return products.filter(
      (product) =>
        (product.name && product.name.toLowerCase().includes(searchTerm)) ||
        (product.brand && product.brand.toLowerCase().includes(searchTerm))
    );
  }, [products, search]);

  if (isLoading && products.length === 0) {
    return <UniversalLoader showProgress={false} showBars={true} />;
  }

  if (error && products.length === 0) {
    return (
      <div className={style.errorContainer}>
        <div className={style.errorMessage}>{error}</div>
        <button className={style.retryButton} onClick={() => fetchProducts()}>
          تلاش مجدد
        </button>
      </div>
    );
  }

  const isEmptyState = filteredProducts.length === 0 && !isLoading;

  return (
    <div className={style.container}>
      {/* Header */}
      <div className={style.header}>
        <h1 className={style.title}>محصولات فروشگاه</h1>

        <div className={style.searchBox}>
          <Search size={18} className={style.searchIcon} />
          <input
            className={style.searchInput}
            type="text"
            placeholder="جستجو بر اساس نام یا برند محصول..."
            value={search}
            onChange={handleSearchChange}
            aria-label="جستجوی محصول"
          />
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className={style.filterContainer}>
          <div className={style.filterHeader}>
            <span className={style.filterLabel}>دسته‌بندی‌ها:</span>
            {activeCategory && (
              <button
                className={style.clearFilter}
                onClick={() => handleCategoryChange(activeCategory)}
              >
                حذف فیلتر
              </button>
            )}
          </div>

          <div className={style.filterBar}>
            {categories.map((category) => (
              <button
                key={category.value}
                className={`
                  ${style.filterBtn}
                  ${activeCategory === category.value ? style.filterBtnActive : ""}
                `}
                onClick={() => handleCategoryChange(category.value)}
                aria-pressed={activeCategory === category.value}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      {isEmptyState ? (
        <div className={style.emptyState}>
          <div className={style.emptyMessage}>
            {search.trim()
              ? `محصولی با عنوان "${search}" یافت نشد.`
              : "در حال حاضر محصولی در این دسته‌بندی موجود نیست."}
          </div>
          {search.trim() && (
            <button className={style.clearSearchButton} onClick={() => setSearch("")}>
              پاک کردن جستجو
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={style.productsInfo}>
            <span className={style.productsCount}>
              نمایش {filteredProducts.length} محصول
              {search.trim() && ` برای "${search}"`}
            </span>
          </div>

          <div className={style.productsGrid}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id || product._id}
                product={product}
                // favorites={favorites}
                // setFavorites={setFavorites}
              />
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {filteredProducts.length > 0 && !isEmptyState && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}

      {/* Loading overlay for subsequent loads */}
      {isLoading && products.length > 0 && (
        <div className={style.loadingOverlay}>
          <UniversalLoader showProgress={true} showBars={true} />
        </div>
      )}
    </div>
  );
}

export default ProductPage;
