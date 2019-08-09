export interface IConfig {
    databaseUrl: string;
}

const config: IConfig = {
    databaseUrl: 'mysql://root:root@127.0.0.1:3306/customer'
}

export { config };