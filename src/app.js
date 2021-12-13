const express = require('express');
const morgan = require('morgan');
const app = express();

// setings
app.set('port', process.env.PORT || 5000);

//middelwares 
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

// Routes
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(require('./routes/routes'));

// starting the server
app.listen(app.get('port') , () => {
    console.log(`Server on port ${app.get('port')}`);
});
