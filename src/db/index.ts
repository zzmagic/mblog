import "reflect-metadata";
import {DataSource, DataSourceOptions} from "typeorm";
import { User } from "./entity/user";
import { UserAuth } from "./entity/userAuth";
import { Article } from "./entity";

const type = "mysql"
const host = process.env.DATABASE_HOST
const port = Number(process.env.DATABASE_PORT)
const username = process.env.DATABASE_USERNAME
const password = process.env.DATABASE_PASSWORD
const database = process.env.DATABASE_NAME

let appDataSourcePromise: Promise<DataSource> | null = null;

export const getDataSource = () => {
    if (!appDataSourcePromise) {
        const dataSource = new DataSource({
            type,
            host,
            port,
            username,
            password,
            database,
            entities: [User, UserAuth, Article],
            logging: true,
            synchronize: false
        });

        appDataSourcePromise = (async () => {
            return await dataSource.initialize()
        })();
    }
    return appDataSourcePromise
}




