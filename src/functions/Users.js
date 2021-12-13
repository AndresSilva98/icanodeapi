const cnx = require('./cnx');
const sql = require('mssql');
const query = require('../querys/querys');
const rol = require('./Rol');
const { response } = require('express');

const getUsers = async function() {
    let status;
    let arrayusers;

    try {
        let pool = await sql.connect(cnx);
        status = await pool.request().query(query.Usuarios);
        arrayusers = status.recordset;
    } catch (err) {
        console.log(err);
    }

    return arrayusers;
}

const ValidateUser = async function(correo, contraseña) {
    let status;
    let arrayusers;
    let response = {status: false};

    try {
        let pool = await sql.connect(cnx);
        status = await pool.request().query(query.Usuarios);
        arrayusers = status.recordset;

        for(let i = 0; i < arrayusers.length; i++) {
            if(arrayusers[i].correo === correo && arrayusers[i].contraseña === contraseña ) {
                response = {
                    status: true,
                    respuesta: {
                        id: arrayusers[i].id,
                        nombre: arrayusers[i].nombre,
                        correo: arrayusers[i].correo,
                        contraseña: arrayusers[i].contraseña,
                        estado: arrayusers[i].estado,
                        rol: arrayusers[i].rol
                    }
                }
            }
        }
    } catch (err) {
        console.log(err);
    }

    return response;
}


const validateID = async function() {
    let status;
    let Reports;

    try {
        let pool = await sql.connect(cnx);
        status = await pool.request().query(query.User);
        Reports = status.recordset;
    } catch (err) {
        console.log(err);
    }

    return Reports.length + 1;
}

const validateIDrol = async function() {
    let status;
    let Reports;

    try {
        let pool = await sql.connect(cnx);
        status = await pool.request().query(query.UserRol);
        Reports = status.recordset;
    } catch (err) {
        console.log(err);
    }

    return Reports.length + 1;
}


const insertUserRol = async function(idUsuario, idPerfil) {
    try {
        let pool = await sql.connect(cnx);
        let newUserrol = await pool.request()
            .input('id', sql.Int, await validateIDrol())
            .input('id_perfil', sql.Int, parseInt(idPerfil))
            .input('id_usuario', sql.Int, parseInt(idUsuario))
            .execute('pr_usuario_perfil');
        return newUserrol.rowsAffected;
    } catch (err) {
        console.log(err);
    }
}


const validateArea = async function(area) {
    let status;

    try {
        let pool = await sql.connect(cnx);
        status = await pool.request().query(`SELECT * FROM dbo.Usuario WHERE area = '${area}'`);
        return status.recordset.length;
    } catch (err) {
        console.log(err);
    }
}

const validateCorreo = async function(Correo) {
    let status;
    let response = 'true';
    
    try {
        let pool = await sql.connect(cnx);
        status = await pool.request().query(`SELECT * FROM dbo.Usuario`);
        const array = status.recordset;

        for(let i = 0; i < array.length; i++) {
            if (Correo === array[i].correo) {
                response = 'false';
            }
        }
    } catch (err) {
        console.log(err);
    }

    return response;
}

const insertUser = async function(Usuario) {
    areavalidate = await validateArea(Usuario.area);

    if(areavalidate <= 40 && Usuario.area === 'Interno' || areavalidate <= 20 && Usuario.area === 'Externo') {
        const correovalidate = await validateCorreo(Usuario.correo);

        if(correovalidate === 'true') {
            try {
                let pool = await sql.connect(cnx);
                let id = await validateID()
                let newUser = await pool.request()
                    .input('id', sql.Int, id)
                    .input('nombre', sql.VarChar, Usuario.nombre)
                    .input('correo', sql.VarChar, Usuario.correo)
                    .input('contraseña', sql.VarChar, Usuario.contraseña)
                    .input('estado', sql.VarChar, Usuario.estado)
                    .input('area', sql.VarChar, Usuario.area)
                    .execute('pr_usuario');
                let reportRol = await insertUserRol(id, await rol.getRolReport(Usuario.rol));
        
                if (newUser.rowsAffected > 0) {
                    return {
                        message: "Usuario creado"
                    };
                } else {
                    return newUser.rowsAffected;
                }
                
            } catch (err) {
                console.log(err);
            }
        } else {
            return {
                message: "El correo ya está relacionado con un usuario"
            };
        }
    } else {
        return {
            message : 'Lo sentimos, el sistema ya cuenta con el número de usuarios permitidos'
        }
    }
}


const UpdatePassword = async function(contraseña) {
    try {
        let pool = await sql.connect(cnx);
        let newUser = await pool.request()
            .input('id', sql.Int, contraseña.id)
            .input('contraseña', sql.VarChar, contraseña.contraseña)
            .execute('pr_contrasena');
        
        return {
            message: "Contraseña Actualizada"
        };
        
    } catch (err) {
        console.log(err);
    }
}

const UpdateRol = async function(rol) {
    try {
        let pool = await sql.connect(cnx);
        let newUser = await pool.request()
            .input('id_perfil', sql.Int, rol.id_perfil)
            .input('id_usuario', sql.VarChar, rol.id_usuario)
            .execute('pr_rol');
        
        return {
            message: "Rol Actualizado"
        };
        
    } catch (err) {
        console.log(err);
    }
}

const UpdateState = async function(estado) {
    try {
        let pool = await sql.connect(cnx);
        let newUser = await pool.request()
            .input('id', sql.Int, estado.id)
            .input('estado', sql.VarChar, estado.estado)
            .execute('pr_estado');
        
        return {
            message: "Estado Actualizado",
            estado: estado.estado
        };
        
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    ValidateUser,
    getUsers,
    insertUser,
    UpdatePassword,
    UpdateRol,
    UpdateState
};