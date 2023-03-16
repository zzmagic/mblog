import type { NextPage } from "next";
import styles from './index.module.scss';

const Footer: NextPage = ({}) => {
    return (
        <div className={styles.footer}>
             <p>©2023 Derlio</p>
        </div>
    )
}

export default Footer;