import {withIronSessionApiRoute} from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from "next";
import {getDataSource} from 'src/db/index';

import {ironOptions} from 'config/index';

import { ISession } from "@/pages/api";

import { Article } from '@/db/entity';
import { EXCEPTION_ARTILE } from '../config/code';

const update = async (req: NextApiRequest, res: NextApiResponse)=> {
    const session: ISession = req.session;
    const {articleId = 0, title = '', content = ''} = req.body;
    const dataSource = await getDataSource();
    const articleRepo = dataSource.getRepository(Article);

    const article = await articleRepo.findOne({
        where: {
            id: articleId
        },
        relations: ['user']
    });

    if (article) {
        article.title = title;
        article.content = content;
        article.update_time = new Date();

        const resArticle = await articleRepo.save(article);
        if (resArticle) {
            res.status(200).json({
                code: 0,
                msg: 'Publish success.'
            })
        } else {
            res.status(200).json({...EXCEPTION_ARTILE.UPDATE_FAILED});
        }
    } else {
        res.status(200).json({...EXCEPTION_ARTILE.ARTICLE_NOT_FOUND});
    }

    

}

export default withIronSessionApiRoute(update, ironOptions);