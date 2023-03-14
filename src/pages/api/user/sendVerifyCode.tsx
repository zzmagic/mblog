import { format } from "date-fns";
import md5 from 'md5';
import {encode} from 'js-base64'
import {withIronSessionApiRoute} from 'iron-session/next'
import { NextApiRequest, NextApiResponse } from "next";
import r from 'src/iapi/fetch'
import {ironOptions} from 'config/index'
import {ISession} from '../index'

const sendVerifyCode =  async function(req: NextApiRequest, res: NextApiResponse) {
    const {to = '', templateId = 1} = req.body;
    const session: ISession = req.session
    const appId = '2c94811c86c00e9b0186d56ea3fd0416';
    const accountId = '2c94811c86c00e9b0186d56ea301040f';
    const authToken = 'e036896ce9cb455bb01d829f559654ee';
    const nowDate = format(new Date(), 'yyyyMMddHHmmss');

    const sigParameter = md5(`${accountId}${authToken}${nowDate}`);
    const authorization = encode(`${accountId}:${nowDate}`);
    const funcdes = 'TemplateSMS';
    const verifyCode = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    const expireMinutes = 5;

    const url = `https://app.cloopen.com:8883/2013-12-26/Accounts/${accountId}/SMS/${funcdes}?sig=${sigParameter}`

    const response = await r.post(url, {
        to, 
        templateId, 
        appId,
        datas: [verifyCode, expireMinutes]
    }, {
        headers: {
            Authorization: authorization
        }
    });

    const {statusCode, statusMsg} = response as any;
    if (statusCode === '000000') {
         session.verifyCode = verifyCode;
         await session.save();
         res.status(200).json({
            code: 0,
            msg: statusMsg,
            data: {
                verifyCode
            }
         });
    } else {
        session.verifyCode = verifyCode;
        await session.save();
        res.status(200).json({
            code: 0,
            msg: statusMsg,
            data: {
                verifyCode
            }
        });
    }

}

export default withIronSessionApiRoute(sendVerifyCode, ironOptions);