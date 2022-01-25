const config = require('../../config/config.json');
const apiController = require('./apiController')

const express = require('express')
const app = express()

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

app.post('/init', function (req, res) {
    res.send(apiController.init())
})

app.post('/onBoard', function (req, res) {
    res.send(apiController.onBoard(req.body))
})

app.post('/offBoard', function (req, res) {
    res.send(apiController.offBoard(req.body))
})

app.get('/load', function (req, res) {
    res.send(apiController.load())
})

app.put('/save', function (req, res) {
    res.send(apiController.save(req.body))
})

app.put('/write', function (req, res) {
    res.send(apiController.write(req.body))
})

app.listen(config.server.port, config.server.host, function () {
    console.log(`listening ${config.server.host}:${config.server.port}`)
})
