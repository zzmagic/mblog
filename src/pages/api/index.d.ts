import { User } from "@/db/entity";
import { IronSession } from "iron-session";

export type ISession = IronSession & Record<string, any>;

export type IArticle = {
    id: number,
    title: string,
    content: string,
    create_time : Date,
    update_time: Date,
    views: number,
    user: User
}