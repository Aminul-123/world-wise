import { NavLink } from "react-router-dom";
import styles from './PageNav.module.css';
import Logo from '../components/Logo'

function PageNav () {

    return (
        <>
    
        <nav >
            <Logo />
            <ul className={styles.nav}>
                
                <li>
                    <NavLink to={'/pricing'} >Pricing</NavLink>
                </li>
                <li>
                    <NavLink to={'/product'} >Product</NavLink>
                </li>
                <li>
                    <NavLink to={'/login'}  className={styles.ctaLink}>Login</NavLink>
                </li>
            </ul>
        </nav>
        </>
    )
}
export default PageNav;