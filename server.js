var express = require('express');
var app = express();
var sql = require ("mssql");
var router = express.Router();
var http = require ("http");


var config = {
    user: '',
    password: '',
    server: '', 
    database: 'Shop',
    port: 1434
};

var server = app.listen(5000, function(){
    console.log('Server is running..');
});

app.use('/api', router);

router.use(function(req, res, next) {
    console.log('Router use macht was.');
    next();
});

router.get('/', function(req, res) {

    res.json({message: 'Welcome to the shop!'});
});

router.route('/Kunden')
    .get(function(req, res) {
        console.log('/Kunden get geroutet')
        sql.connect(config, function (err) {
            if (err) console.log(err);
            //create request object
            var request = new sql.Request();
            //query to the database to get respond
            request.query('Select * From Kunde', function(err, result) {
            
                if (err) console.log(err)
            
                //send records as a response
                res.json({ Data: result.recordset});
            });
        });
    }); //http://h2840518.stratoserver.net:5000/api/Kunden

    router.route('/Kunde/:Ort')
    .get(function(req, res) {
        console.log('/Kunden get geroutet')
        sql.connect(config, function (err) {
            if (err) console.log(err);
            //create request object
            var request = new sql.Request();
            request.input('Ort', sql.NVarChar , req.params.Ort);
            //query to the database to get respond
            request.query('Select * From Kunde WHERE Ort = @Ort', function(err, result) {
            
                if (err) console.log(err)
                console.log(result.recordset);
                //send records as a response
                res.json({ Data: result.recordset});
            });
        });
    }); //http://h2840518.stratoserver.net:5000/api/Kunde/Karlsruhe

    router.route('/newArticle/Bezeichnung=:Bezeichnung&Beschreibung=:Beschreibung&Preis=:Preis')
    .post(function(req, res, next){
        //puts a new user in the Database
        console.log('/newuser geroutet');
        //sql connection
        sql.connect(config, function(err){
            if(err) console.log(err);

        //building request
        var request = new sql.Request();
        request.input('Bezeichnung', sql.NVarChar, req.params.Bezeichnung);
        request.input('Beschreibung', sql.NText, req.params.Beschreibung);
        request.input('Preis', sql.Float, req.params.Preis);
       

        request.query('INSERT INTO Artikel([Bezeichnung],[Beschreibung] ,[Preis]) VALUES (@Bezeichnung, @Beschreibung,@Preis)', function(err, result) {
            if(err) console.log(err);

        res.json({message: 'Successful'});
        });
        });

    });