import {withIronSessionApiRoute} from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from "next";
import {getDataSource} from 'src/db/index';

import {ironOptions} from 'config/index';
import { User } from '@/db/entity/user';

import { ISession } from "@/pages/api";
import { UserAuth } from '@/db/entity/userAuth';

import {Cookie} from 'next-cookie'
import {setCookie} from '@/utils/index'

const login = async (req: NextApiRequest, res: NextApiResponse)=> {
    const {phone = '', verifyCode = '', identity_type = 'phone'} = req.body;
    const session = req.session;
    const cookies = Cookie.fromApiRoute(req, res);

    const dataSource = await getDataSource();
    const userRepo = dataSource.getRepository(User);
    const userAuthRepo = dataSource.getRepository(UserAuth);

    if (String(session.verifyCode) === String(verifyCode)) {
        // const userAuth = await userAuthRepo.createQueryBuilder('user_auths')
        //             .where("user_auths.identity_type = :identity_type", {identity_type })
        //             .andWhere("user_auths.identifier == :identifier", {identifier: phone})
        //             .leftJoinAndSelect('user', 'user_auths.user')
        //             .getOne();

        const userAuth = await userAuthRepo.findOne({
            where: {identity_type, identifier: phone},
            relations: ['user']
        })

        console.log(userAuth);

        if (userAuth) {
            const user = await userAuth.user;
            console.log(user);
            const {id, nickname, avatar} = user;

            session.userId = id;
            session.nickname = nickname;
            session.avatar = avatar;

            await session.save();

            setCookie(cookies, {id, nickname, avatar});

            res.status(200).json({
                code : 0,
                msg : 'login success',
                data: {
                    userId: id,
                    nickname,
                    avatar
                }
            });

        } else {
            const user = new User();
            user.nickname = `User_${Math.floor(Math.random() * 10000)}`;
            user.avatar = 'images/default_avatar.webp';
            user.job = "None.";
            user.introduce = 'None.';

            const userAuth = new UserAuth();
            userAuth.identity_type = identity_type;
            userAuth.identifier = phone;
            userAuth.credential = session.verifyCode;
            userAuth.user = user;

            const resUserAuth = await userAuthRepo.save(userAuth);
            console.log(resUserAuth);

            const {
                user: {id, nickname, avatar}
            } = userAuth;

            session.userId = id;
            session.nickname = nickname;
            session.avatar = avatar;

            await session.save();

            setCookie(cookies, {id, nickname, avatar});

            res.status(200).json({
                code : 0,
                msg : 'login success',
                data: {
                    userId: id,
                    nickname,
                    avatar
                }
            });

        }
    } else {
        res.status(200).json({
            code : -1,
            msg : 'verify code error.',
        });
    }
    
}

export default withIronSessionApiRoute(login, ironOptions);