import { getDataSource } from "@/db";
import { Article } from "@/db/entity";
import { Avatar } from "antd";
import { IArticle } from "../api";
import styles from './index.module.scss';
import {formatDistanceToNow} from 'date-fns'
import { observer } from "mobx-react-lite";
import { useStore } from "@/store";
import Link from "next/link";
import MarkDown from "markdown-to-jsx";

interface IProps {
    article: IArticle
}

export async function getServerSideProps({params}){

    const articleId = params?.id;
    console.log(params);
    const dataSource = await getDataSource();
    const article = await dataSource.getRepository(Article).findOne(
        {
            where: {
                id: articleId
            },
            relations: ['user']
        }
    )

    if (article) {
        article.views = article.views + 1;
        await dataSource.getRepository(Article).save(article);
    }

    return {
        props: {
            article: JSON.parse(JSON.stringify(article))
        }
    }
}

const ArticleDetail = (promps: IProps) => {

    const store = useStore();
    const loginUserInfo = store?.user?.userInfo;

    const {article} = promps;
    const {user: {nickname, avatar, id}} = article;
    console.log(avatar);

    return <div>
        <div className="content-layout">
            <h2 className={styles.title}>{article?.title}</h2>
            <div className={styles.user}>
                <Avatar src={avatar} size={50}/>
                <div className={styles.info}>
                    <div className={styles.name}>{nickname}</div>
                    <div className={styles.date}>
                        <div>{formatDistanceToNow(new Date(article?.update_time))}</div>
                        <div>views {article?.views}</div>
                        {
                        Number(loginUserInfo?.userId) === Number(id) && (
                            <Link href={`/editor/${article?.id}`}>Edit</Link>
                        )
                    }
                    </div>
                </div>
            </div>
            <MarkDown className={styles.markdown}>{article?.content}</MarkDown>
        </div>
    </div>
}

export default observer(ArticleDetail);