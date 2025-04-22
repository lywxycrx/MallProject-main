//连接数据库
import { createConnection } from 'mysql';

//创建数据库连接
const client = createConnection({
    host: 'localhost', 
    user: 'root',       
    password: '459733', 
    database: 'db_mall',
    port:'3306'
})

//Encapsulate database operation statements
// sql: statement
// arr: parameter array   
// callback: success function result
function sqlFn(sql, arr, callback) {
    client.query(sql, arr, function (error, result) {
        if (error) {
            console.log(error);
            console.log('Database statement error');
            return;
        }
        callback(result)
    })
}

export default sqlFn
