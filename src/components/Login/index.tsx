import type { NextPage } from "next";
import styles from './index.module.scss'
import { ChangeEvent, useState } from "react";
import CountDown from "../CountDown";
import { message } from "antd";
import r from 'src/iapi/fetch'
import { useStore } from "@/store";
import { observer } from "mobx-react-lite";

interface IProps {
    isShow: boolean;
    onClose: Function
}

const Login = (props: IProps) => {
    const {isShow = false, onClose} = props

    const store = useStore();

    const [form, setForm] = useState({
        phone: '',
        verifyCode: ''
    })

    const [isShowVerifyCode, setIsShowVerifyCode] = useState(false)

    const handleFormChange = (e: ChangeEvent<HTMLInputElement> ) => {
        const {name, value} = e?.target;
        setForm({...form, [name]: value})
    }

    const handleClose = () => {

    }

    const handleGetVerifyCode = () => {
        if(!form?.phone) {
            message.warning('Please input your phone number.');
            return;
        }
        r.post('/api/user/sendVerifyCode', {
            to: form?.phone,
            templateId : 1,
        }).then((res: any) => {
            if (res?.code ===0) {
                setIsShowVerifyCode(true)
            }else {
                message.error(res?.msg || 'Unknown error.')
            }
        });
    }

    const handleLogin = () => {
        console.log(form);
        r.post('/api/user/login', {
            ...form,
            identity_type: 'phone'
        }).then((res: any) => {
            if(res?.code === 0) {
                store.user.setUserInfo(res.data)
                console.log(22222);
                console.log(store);
                onClose && onClose();
            } else {
                message.error(res?.msg || 'Unknown error.')
            }
        });
    }
//79ad27cd3121921c335e
    //10af6d3f656d44a6eb949e94e1c8c46e0688a5a5
    const handleOauthGithub = () => {
        const githubClientId = '79ad27cd3121921c335e';
        window.open(`https://github.com/login/oauth/authorize?client_id=${githubClientId}&scope=user:email`)

    }

    const handleCountDownEnd = () => {
        setIsShowVerifyCode(false);
    }

    return (isShow ? (
        <div className={styles.loginArea}>
            <div className={styles.loginBox}>
                <div className={styles.loginTitle}>
                    <div>Mobile login</div>
                    <div className={styles.close} onClick={handleClose}>x</div>
                </div>
                <input name="phone" type="text" placeholder="Please input your phone number." value={form.phone} onChange={handleFormChange}/>
                <div className={styles.verifyCodeArea}>
                    <input name="verifyCode" type="text" placeholder="Input verify code" value={form.verifyCode} onChange={handleFormChange}/>
                    <span className={styles.getVerifyCode} onClick={handleGetVerifyCode}>
                        {isShowVerifyCode ? <CountDown time={10} onEnd={handleCountDownEnd}/> : "Get verify code"}
                    </span>
                </div>
                <div className={styles.loginBtn} onClick={handleLogin}>Login</div>
                <div className={styles.oauthGithubBtn} onClick={handleOauthGithub}>Login with github</div>
                <div className={styles.loginPrivacy}>
                    Login means agree <a href="https://moco.imooc.com/privacy.html" target="_blank" rel="noreferrer">privacy</a>
                </div>
            </div>
        </div>
    ) : null)
}

export default observer(Login);