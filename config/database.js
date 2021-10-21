const mysql = require("mysql");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'final_year_students_project_regigration'
});

module.exports = {
    db: db
}