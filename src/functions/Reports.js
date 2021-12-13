const cnx = require('./cnx');
const sql = require('mssql');
const query = require('../querys/querys');
const { response } = require('express');
const rol = require('./Rol');
const auth = require('./Authentication');

const getReports = async function(reportname) {
    let status;
    let Report;
    let response = {status: false};

    try {
        let pool = await sql.connect(cnx);
        status = await pool.request().query(query.Report);
        Report = status.recordset;

        for (let i = 0; i < Report.length; i++) {
            if(Report[i].name === reportname) {
                response = {
                    status: true,
                    reporte: {
                        id: Report[i].id,
                        name: Report[i].name,
                        id_report: Report[i].id_report,
                        id_workspace: Report[i].id_workspace,
                        embedUrl: Report[i].embedUrl,
                        accessToken : await auth.getAccessToken()
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
        status = await pool.request().query(query.Report);
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
        status = await pool.request().query(query.ReportRol);
        Reports = status.recordset;
    } catch (err) {
        console.log(err);
    }

    return Reports.length + 1;
}

const insertReportrol = async function(idReporte, idPerfil) {
    try {
        let pool = await sql.connect(cnx);
        let newReportrol = await pool.request()
            .input('id', sql.Int, await validateIDrol())
            .input('id_reporte', sql.Int, parseInt(idReporte))
            .input('id_perfil', sql.Int, parseInt(idPerfil))
            .execute('pr_reporte_perfil');
        return newReportrol.rowsAffected;
    } catch (err) {
        console.log(err);
    }
}

const insertReport = async function(Reporte) {
    try {
        let pool = await sql.connect(cnx);
        let id = await validateID()
        let newReport = await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.VarChar, Reporte.name)
            .input('id_report', sql.VarChar, Reporte.id_report)
            .input('id_workspace', sql.VarChar, Reporte.id_workspace)
            .input('embedUrl', sql.VarChar, Reporte.embedUrl)
            .execute('pr_reporte');
        let reportRol = await insertReportrol(id, await rol.getRolReport(Reporte.rol));

        if (newReport.rowsAffected > 0) {
            return {
                message: "Tablero creado"
            };
        } else {
            return newReport.rowsAffected;
        }
        
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getReports, insertReport
}