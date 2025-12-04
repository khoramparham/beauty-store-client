import { Link } from "react-router-dom";
import style from "./404.module.css";
export default function NotFound() {
  return (
    <div className={style.card_container}>
      <h1 className={style.error_code}>404</h1>
      <h2 className={style.error_title}>صفحه مورد نظر یافت نشد</h2>
      <p className={style.error_message}>
        متاسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا حذف شده است. لطفاً به صفحه
        اصلی سایت بازگردید.
      </p>
      <Link to="/" className={style.home_button}>
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
