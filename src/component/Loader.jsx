import React from "react";
import styles from "./Loader.module.css";

// حلقه‌ها و گل وسط
export const LoaderRing = () => {
  const petals = [...Array(5)];

  return (
    <div className={styles.ringContainer}>
      <div className={styles.outerRing}></div>
      <div className={styles.middleRing}></div>
      <div className={styles.innerRing}></div>

      <div className={styles.flowerContainer}>
        <div className={styles.flowerBase}>
          {petals.map((_, i) => (
            <div
              key={i}
              className={styles.petal}
              style={{
                transform: `rotate(${i * 72}deg) translate(15px) rotate(-${i * 72}deg)`,
              }}
            ></div>
          ))}
          <div className={styles.flowerCenter}></div>
        </div>
      </div>
    </div>
  );
};

// نوارهای عمودی متحرک
export const LoaderBars = () => {
  return (
    <div className={styles.barsContainer}>
      <div className={`${styles.bar} ${styles.bar1}`}></div>
      <div className={`${styles.bar} ${styles.bar2}`}></div>
      <div className={`${styles.bar} ${styles.bar3}`}></div>
    </div>
  );
};

// نوار پیشرفت متحرک
export const LoaderProgress = () => {
  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressBar}></div>
    </div>
  );
};

// یک کامپوننت همه کاره برای استفاده‌های مختلف
export const UniversalLoader = ({
  message = "در حال بارگذاری...",
  showProgress = true,
  showRing = false,
  showBars = false,
}) => {
  return (
    <div className={styles.productLoaderContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.loadingText}>{message}</div>

        {showProgress && <LoaderProgress />}
        {showRing && <LoaderRing />}
        {showBars && <LoaderBars />}

        {/* ترکیب مختلفی از لودرها */}
        {!showProgress && !showRing && !showBars && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <LoaderRing />
            <LoaderBars />
            <LoaderProgress />
          </div>
        )}
      </div>
    </div>
  );
};

// لودر ساده برای استفاده در بخش‌های کوچک
export const MiniLoader = () => {
  return (
    <div className={styles.ringContainer} style={{ width: "50px", height: "50px" }}>
      <div className={styles.middleRing} style={{ width: "100%", height: "100%" }}></div>
    </div>
  );
};

// لودر دکمه
export const ButtonLoader = () => {
  return (
    <div className={styles.barsContainer} style={{ gap: "4px", marginBottom: "0" }}>
      <div
        className={styles.bar}
        style={{
          width: "3px",
          height: "12px",
          backgroundColor: "#fff",
          animationDelay: "0s",
        }}
      ></div>
      <div
        className={styles.bar}
        style={{
          width: "3px",
          height: "12px",
          backgroundColor: "#fff",
          animationDelay: "0.15s",
        }}
      ></div>
      <div
        className={styles.bar}
        style={{
          width: "3px",
          height: "12px",
          backgroundColor: "#fff",
          animationDelay: "0.3s",
        }}
      ></div>
    </div>
  );
};
