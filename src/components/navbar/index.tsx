import type { NextPage } from "next";
import Link from "next/link";
import {navs} from './config';
import styles from './index.module.scss';
import { useRouter } from "next/router";
import { Button } from "antd";
import { useState } from "react";
import Login from 'src/components/Login';

const Navbar: NextPage = () => {
    const {pathname} = useRouter();
    const [isShowLogin, setIsShowLogin] = useState(false);

    const handleGoToEditorPage = () => {

    }

    const handleLogin = () => {
        setIsShowLogin(true)
    }

    const handleLoginClose = () => {
        setIsShowLogin(false)
    }

    return (
        <div className={styles.navbar}>
            <section className={styles.logoArea}>MBlog</section>
            <section className={styles.linkArea}>
                {
                    navs?.map(nav => (
                        <Link legacyBehavior key={nav?.label} href={nav?.value}>
                            <a className={pathname === nav?.value ? styles.active : ''}>{nav?.label}</a>
                        </Link>
                    ))
                }
            </section>
            <section className="w-60 text-center ml-40">
                <button onClick={handleGoToEditorPage} className="bg-slate-200 active:bg-slate-400 w-24 h-8 pl-2 pr-2 rounded-md text-gray-800 hover:bg-gray-300">Post blog</button>
                <button onClick={handleLogin} className="text-white ml-4 bg-lime-600 border-transparent w-24 h-8 pl-2 pr-2 rounded-md hover:bg-lime-700 hover:text-gray-100">Login</button>
            </section>

            <Login isShow={isShowLogin} onClose={handleLoginClose}/>
        </div>
    )
}

export default Navbar;