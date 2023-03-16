import Link from "next/link";
import { IArticle } from "@/pages/api";
import styles from './index.module.scss';
import { EyeOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import {formatDistanceToNow} from 'date-fns'

interface IProps {
    article: IArticle
}

const ListItem = (props: IProps) => {

    const {article} = props;
    return(
        <Link href={`/article/${article.id}`}>
            <div className={styles.container}>
                <div className={styles.article}>
                    <div className={styles.userInfo}>
                        <span className={styles.name}>{article?.user?.nickname}</span>
                        <span className={styles.date}>{formatDistanceToNow(new Date(article?.update_time))}</span>
                    </div>
                    <h4 className={styles.title}>{article?.title}</h4>
                    <p className={styles.content}>{article?.content}</p>
                    <div className={styles.statistics}>
                        <EyeOutlined />
                        <span>{article?.views}</span>
                    </div>
                </div>
                <Avatar src={article?.user?.avatar} size={48}/>
            </div>
        </Link>
    );
}

export default ListItem;