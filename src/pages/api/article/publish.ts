import {withIronSessionApiRoute} from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from "next";
import {getDataSource} from 'src/db/index';

import {ironOptions} from 'config/index';
import { User } from '@/db/entity/user';

import { ISession } from "@/pages/api";

import {Cookie} from 'next-cookie'
import {setCookie} from '@/utils/index'
import { Article } from '@/db/entity';
import { EXCEPTION_ARTILE } from '../config/code';

const publish = async (req: NextApiRequest, res: NextApiResponse)=> {
    const session: ISession = req.session;
    const {title = '', content = ''} = req.body;
    const dataSource = await getDataSource();
    const userRepo = dataSource.getRepository(User);
    const articleRepo = dataSource.getRepository(Article);

    const article = new Article();
    article.title = title;
    article.content = content;
    article.create_time = new Date();
    article.update_time = new Date();
    article.is_delete = 0;
    article.views = 0;

    const user = await userRepo.findOne({
        where: {id: session.userId}
    });

    if (user) {
        article.user = user;
    }

    const resArticle = await articleRepo.save(article);
    if (resArticle) {
        res.status(200).json({
            code: 0,
            msg: 'Publish success.'
        })
    } else {
        res.status(200).json({...EXCEPTION_ARTILE});
    }

}

export default withIronSessionApiRoute(publish, ironOptions);