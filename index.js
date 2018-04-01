const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');

const PORT = process.env.PORT || 5000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/webhook', function(req, res) {

    var forwardData = {
        content: "gitlab sent a message!",
        username: "custom-username",
        avatar_url: `${req.headers.host}/images/gitlab-logo.png`,
        tts: false
    }

    console.log('Forward Data:');
    console.log(forwardData);

    res.status(200);
    res.send('Hello World!');
});

app.get('/images/gitlab-logo.png', function(req, res) {
    res.sendFile(path.join(__dirname, 'images', 'gitlab-logo.png'));
});

app.post('/webhook', function(req, res) {
    console.log('Headers: ');
    console.log(req.headers);
    console.log('Body: ');
    console.log(req.body);

    var forwardData = {
        content: "gitlab sent a message!",
        username: "custom-username",
        avatar_url: `${req.headers.host}/images/gitlab-logo.png`,
        tts: false
    }

    console.log('Forward Data:');
    console.log(forwardData);

    request({
        url: 'https://discordapp.com/api/webhooks/429916549017763841/-3yqpx7q_5WQV2WmLRJD50HaE5KblxZH7nU93PsTw3PMPQ6kmV0i2bIFOT0bHOsjQDMz',
        method: 'POST',
        json: true,
        body: forwardData
    }, function(error, resp, body) {
        console.log('Discord Response');
        console.log(resp);
    })

    res.status(200);
    res.send('OK');
});

app.listen(PORT, () => console.log(`Gitlab Discord Transformer listening on port ${PORT}`));
