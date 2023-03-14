import { ironOptions } from 'config';
import {withIronSessionApiRoute} from 'iron-session/next';
import { NextApiRequest, NextApiResponse } from "next";

import { ISession } from "@/pages/api";

import {Cookie} from 'next-cookie'
import {setCookie} from '@/utils/index'
import { clearCookie } from '@/utils/index';

const logout = async (req: NextApiRequest, res: NextApiResponse)=> {
    const session = req.session;
    const cookies = Cookie.fromApiRoute(req, res);

    await session.destroy();

    clearCookie(cookies);

    res.status(200).json({
        code: 0,
        msg: 'ok',
        data: {}
    });
}

export default withIronSessionApiRoute(logout, ironOptions);