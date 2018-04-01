const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/webhook', function(req, res) {
    res.send('Hello World!');
});

app.post('/webhook', function(req, res) {
    console.log(req);
    res.status(200);
    res.send('OK');
});

app.listen(8100, () => console.log('Gitlab Discord Transformer listening on port 8100!'));
