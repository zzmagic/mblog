import type { NextPage } from "next";
import Link from "next/link";
import {navs} from './config';
import styles from './index.module.scss';
import { useRouter } from "next/router";
import { Avatar, Button, Dropdown, Menu, message } from "antd";
import { useState } from "react";
import Login from 'src/components/Login';
import { useStore } from "@/store";
import r from 'src/iapi/fetch'
import { observer } from "mobx-react-lite";

const Navbar: NextPage = () => {
    const store = useStore();
    const {userId, nickname, avatar} = store.user.userInfo;
    const {pathname, push} = useRouter();
    const [isShowLogin, setIsShowLogin] = useState(false);

    const handleGoToEditorPage = () => {
        if (userId) {
            push('/editor/new');
        } else {
            message.warning('Please login.');
        }
    }

    const handleLogin = () => {
        setIsShowLogin(true)
    }

    const handleLoginClose = () => {
        setIsShowLogin(false)
    }

    const renderDropDownMenu = () => {
        return(
            <Menu>
                <Menu.Item onClick={handleGoToProfile}>Profile</Menu.Item>
                <Menu.Item onClick={handleLogout}>Logout</Menu.Item>
            </Menu>
        )
    }

    const handleGoToProfile = () => {
        push(`/user/${userId}`);
    }

    const handleLogout = () => {
        r.post('/api/user/logout')
        .then((res: any) => {
            if (res?.code === 0) {
                store.user.setUserInfo({})
            }
        })
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

                {
                    userId ?(
                        <>
                            <Dropdown overlay={renderDropDownMenu()} placement="bottomLeft">
                                <Avatar src={avatar} size={32}/>
                            </Dropdown>
                        </>
                    ) : <button onClick={handleLogin} className="text-white ml-4 bg-lime-600 border-transparent w-24 h-8 pl-2 pr-2 rounded-md hover:bg-lime-700 hover:text-gray-100">Login</button>
                }

                
            </section>

            <Login isShow={isShowLogin} onClose={handleLoginClose}/>
        </div>
    )
}

export default observer(Navbar);