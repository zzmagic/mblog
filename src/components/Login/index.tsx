import type { NextPage } from "next";
import styles from './index.module.scss'
import { ChangeEvent, useState } from "react";
import CountDown from "../CountDown";
import { message } from "antd";
import r from 'src/iapi/fetch'

interface IProps {
    isShow: boolean;
    onClose: Function
}

const Login = (props: IProps) => {
    const {isShow = false} = props

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

    }

    const handleOauthGithub = () => {

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

export default Login