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

import { getDataSource } from "@/db";
import { Article } from "@/db/entity";
import { IArticle } from "../api";

interface IProps {
    article: IArticle
}

export async function getServerSideProps({params}) {
    const articleId = params?.id;
    console.log(params?.id);

    const dataSource = await getDataSource();
    const article = await dataSource.getRepository(Article).findOne(
        {
            where: {
                id: articleId
            },
            relations: ['user']
        }
    )
    console.log(article);
    return {
        props: {
            article: JSON.parse(JSON.stringify(article))
        }
    };
}

const MDEditor = dynamic(
    () => import("@uiw/react-md-editor"),
    { ssr: false }
  );

const ModifyEditor = ({article} : IProps) => {

    const [title, setTitle] = useState(article?.title || '');
    const [content, setContent] = useState(article?.content ||'');
    const {userId} = useStore().user.userInfo;
    const {push, query} = useRouter();

    const handleUpdate = () => {
        if (!title) {
            message.warning('Title can not be empty.');
            return;
        }
        r.post('/api/article/update',{
            articleId: article?.id,
            title,
            content
        }).then((res: any) => {
            if (res?.code === 0) {
                message.success('Update success.');
                article?.id ? push(`/article/${article?.id}`) : push('/');
            } else {
                message.error(res?.msg || 'Update error.');
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
            <button className={styles.button} onClick={handleUpdate}>Update</button>
        </div>
      <MDEditor value={content} height={800} onChange={handleContentChange} />
    </div>
  );
}

(ModifyEditor as any).layout = null;

export default observer(ModifyEditor);