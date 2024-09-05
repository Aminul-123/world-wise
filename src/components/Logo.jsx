import { Link } from "react-router-dom";
import styles from "./Logo.module.css";

function Logo() {
  return (
    <div className={styles.logoCont}>
       <Link to={'/'} className={styles.logo} >
            <img src="/logo.png" alt="WorldWise logo" className={styles.logo} />;
       </Link>

    </div>
  )
}

export default Logo;