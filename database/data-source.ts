import { DataSource, DataSourceOptions } from "typeorm";
export const dataSourceOptions:DataSourceOptions = {
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "Chien16112003@",
        database: "blog",
        entities: ['dist/**/*.entity.js'],
        migrations: ['dist/database/migrations/*.js'],
        synchronize: true,
}
const dataSource  = new DataSource(dataSourceOptions);
export default dataSource;