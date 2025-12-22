import { useMemo } from "react";
import { ChevronRight, ChevronLeft } from "react-feather";
import PropTypes from "prop-types";
import styles from "./Pagination.module.css";

const Pagination = ({
  pagination,
  onPageChange,
  className = "",
  maxVisiblePages = 5,
  showInfo = true,
}) => {
  const {
    page = 1,
    totalPages = 1,
    hasNext = false,
    hasPrev = false,
    total = 0,
    limit = 20,
  } = pagination || {};

  const handlePageChange = (newPage) => {
    if (newPage === page) return;
    if (newPage >= 1 && newPage <= totalPages && onPageChange) {
      onPageChange(newPage);
    }
  };

  const pageNumbers = useMemo(() => {
    if (totalPages <= 0) return [];

    const pages = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const halfVisible = Math.floor(maxVisiblePages / 2);

      if (page <= halfVisible + 1) {
        for (let i = 1; i <= maxVisiblePages - 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (page >= totalPages - halfVisible) {
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - maxVisiblePages + 2; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("ellipsis");
        pages.push(page - 1);
        pages.push(page);
        pages.push(page + 1);
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [page, totalPages, maxVisiblePages]);

  const renderPageNumbers = () => {
    if (pageNumbers.length === 0) return null;

    return pageNumbers.map((pageNum, index) => {
      if (pageNum === "ellipsis") {
        return (
          <span key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden="true">
            ...
          </span>
        );
      }

      const isActive = page === pageNum;

      return (
        <button
          key={`page-${pageNum}`}
          onClick={() => handlePageChange(pageNum)}
          className={`${styles.button} ${isActive ? styles.buttonActive : ""}`}
          aria-label={`صفحه ${pageNum}`}
          aria-current={isActive ? "page" : undefined}
          disabled={isActive}
        >
          {pageNum}
        </button>
      );
    });
  };

  return (
    <nav className={`${styles.container} ${className}`} aria-label="صفحه‌بندی">
      <div className={styles.content}>
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={!hasPrev}
          className={styles.navButton}
          aria-label="صفحه قبلی"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>

        <div className={styles.pages}>{renderPageNumbers()}</div>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!hasNext}
          className={styles.navButton}
          aria-label="صفحه بعدی"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>
      </div>

      {showInfo && (
        <div className={styles.info}>
          {totalPages > 1 && `  صفحه ${page} از ${totalPages}`}
        </div>
      )}
    </nav>
  );
};

Pagination.propTypes = {
  pagination: PropTypes.shape({
    page: PropTypes.number,
    limit: PropTypes.number,
    total: PropTypes.number,
    totalPages: PropTypes.number,
    hasNext: PropTypes.bool,
    hasPrev: PropTypes.bool,
  }).isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  maxVisiblePages: PropTypes.number,
  showInfo: PropTypes.bool,
};

Pagination.defaultProps = {
  className: "",
  maxVisiblePages: 5,
  showInfo: true,
};

export default Pagination;
