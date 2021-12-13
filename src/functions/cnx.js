const cnx = {
    user: 'icaadmin',
    password: 'ICA_2021',
    server: 'synapse-ica.sql.azuresynapse.net',
    database: 'ANALITICA_ICA',
    otpions: {
        trustedconnection: false,
        enableArithAbort: true,
        encrypt : false
    }
}

module.exports = cnx;