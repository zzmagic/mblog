import type { NextPage} from "next";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import { useState } from "react";
import styles from './new.module.scss';
import {Button, message} from 'antd';
import r from '@/iapi/fetch';
import {observer} from 'mobx-react-lite';
import { useStore } from "@/store";
import {useRouter} from 'next/router';
import UserProfile from "../user/[id]";

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
  );

const NewEditor: NextPage = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const {userId} = useStore().user.userInfo;
    const {push} = useRouter();

    const handlePostNow = () => {
        if (!title) {
            message.warning('Title can not be empty.');
            return;
        }
        r.post('/api/article/publish',{
            title,
            content
        }).then((res: any) => {
            if (res?.code === 0) {
                message.success('Publish success.');
                userId? push(`/user/${userId}`) : push('/');
            } else {
                message.error(res?.msg || 'Publish success.');
            }
        });
    }

    const handleTitleChange =(event: any) => {
        setTitle(event?.target?.value);
    }

    const handleContentChange = (content: any) => {
        setContent(content);
    }

    return (
    <div className={styles.container}>
        <div className={styles.operation}>
            <input className={styles.title} placeholder="New Post Title" value={title} onChange={handleTitleChange}/>
            <button className={styles.button} onClick={handlePostNow}>Post Now</button>
        </div>
      <MDEditor value={content} height={800} onChange={handleContentChange} />
    </div>
  );
}

(NewEditor as any).layout = null;

export default observer(NewEditor);