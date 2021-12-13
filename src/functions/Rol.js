const cnx = require('./cnx');
const sql = require('mssql');
const query = require('../querys/querys');

const getRol = async function() {
    let status;
    let rolUser;

    try {
        let pool = await sql.connect(cnx);
        status = await pool.request().query(query.Rol);
        rolUser = status.recordset;
    } catch (err) {
        console.log(err);
    }

    return rolUser;
}

const getRolReport = async function(rol) {
    const array = await getRol();
    let id = 0;
    for(let i = 0; i < array.length; i++) {
        if(array[i].rol === rol) {
            id = array[i].id;
        }
    }

    return id;
}


module.exports = {
    getRol, getRolReport    
}