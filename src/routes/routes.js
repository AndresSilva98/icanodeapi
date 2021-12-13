const { Router, response } = require('express');
const router = Router();
const auth = require('../functions/Authentication');
const users = require('../functions/Users');
const rol = require('../functions/Rol');
const report = require('../functions/Reports');

router.get('/', async (req, res) => {
    let tokenResponse;
    tokenResponse = await auth.getAccessToken();
    res.json(tokenResponse);
})

router.get('/users', async (req, res) => {
    let usersResponse;
    usersResponse = await users.getUsers();
    res.json(usersResponse);
})

router.get('/rol', async (req, res) => {
    let rolResponse; 
    rolResponse = await rol.getRol();
    res.json(rolResponse);
})

router.post('/reports/create', async (req, res) => {
    let response = await report.insertReport(req.body);
    res.json(response);
})

router.post('/reports/report', async (req, res) => {
    let reportResponse; 
    reportResponse = await report.getReports(req.body.name);
    res.json(reportResponse);
})

router.post('/users/create', async (req, res) => {
    let response = await users.insertUser(req.body);
    res.json(response);
})

router.post('/users/password', async (req, res) => {
    let response = await users.UpdatePassword(req.body);
    res.json(response);
})

router.post('/users/rolupdate', async (req, res) => {
    let response = await users.UpdateRol(req.body);
    res.json(response);
})

router.post('/users/stateupdate', async (req, res) => {
    let response = await users.UpdateState(req.body);
    res.json(response);
})

router.post('/users/validar', async (req, res) => {
    let validateResponse = await users.ValidateUser(req.body.correo, req.body.contraseña);
    res.json(validateResponse);
})

module.exports = router