import {withIronSessionApiRoute} from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from "next";
import {ironOptions} from 'config/index';
import {getDataSource} from 'src/db/index';
import { User } from '@/db/entity/user';
import { ISession } from "@/pages/api";

import {Cookie} from 'next-cookie'
import {setCookie, clearCookie} from '@/utils/index'

import r from '@/iapi/fetch'
import { UserAuth } from '@/db/entity/userAuth';

const redirect = async (req: NextApiRequest, res: NextApiResponse)=> {
    const session: ISession = req.session;
    const {code} = req.query || {};

    //79ad27cd3121921c335e
    //10af6d3f656d44a6eb949e94e1c8c46e0688a5a5
    const githubClientId = '79ad27cd3121921c335e';
    const githubSecret = '10af6d3f656d44a6eb949e94e1c8c46e0688a5a5';

    const url = `https://github.com/login/oauth/access_token?` 
                    + `client_id=${githubClientId}`
                    + `&client_secret=${githubSecret}`
                    + `&code=${code}`;
    
    const result = await r.post(url, {}, {
        headers: {
            accept: 'application/json'
        }
    })

    const {access_token} = result as any

    const githubUserInfo = await r.get('https://api.github.com/user', {
        headers: {
            Accept: 'application/json',
            Authorization: `token ${access_token}`
        }
    })

    const cookies = Cookie.fromApiRoute(req, res);
    const userAuthRepo = (await getDataSource()).getRepository<UserAuth>(UserAuth)

    let userAuth = await userAuthRepo.findOne({
        where: {identity_type: 'github', identifier: githubClientId},
        relations: ['user']
    })
    if (userAuth) {
        const user = userAuth.user;
        const {id, nickname, avatar} = user;
        userAuth.credential = access_token;

        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar; 

        await session.save();

        setCookie(cookies, {id, nickname, avatar});

        res.writeHead(302, {
            Location: '/'
        });
    } else {
        console.log(githubUserInfo);
        const {login = '', avatar_url = ''} = githubUserInfo as any;
        const user = new User();
        user.nickname = login;
        user.avatar = avatar_url;

        userAuth = new UserAuth();
        userAuth.identity_type = 'github';
        userAuth.identifier = githubClientId;
        userAuth.credential = access_token;
        userAuth.user = user;

        const resUserAuth = await userAuthRepo.save(userAuth);
        const {id, nickname, avatar} = resUserAuth?.user;
        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar; 

        await session.save();

        setCookie(cookies, {id, nickname, avatar});

        res.writeHead(302, {
            Location: '/'
        });
    }


}

export default withIronSessionApiRoute(redirect, ironOptions);