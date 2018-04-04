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
        content: "Sending a test message!",
        username: "gitlab-bot",
        avatar_url: `https://${req.headers.host}/images/gitlab-logo.png`,
        tts: false,
        embeds: [
            {
                title: "Embedded Message",
                description: "Gitlab event",
                type: "rich",
                footer: {
                    text: "footer text",
                }
            },
        ]
    }

    console.log('Forward Data:');
    console.log(forwardData);

    res.status(200);
    res.send('Hello World!');
    res.end();
});

app.get('/images/gitlab-logo.png', function(req, res) {
    res.sendFile(path.join(__dirname, 'images', 'gitlab-logo.png'));
});

app.post('/webhook', function(req, res) {
    console.log('Headers: ');
    console.log(req.headers);
    console.log('Body: ');
    console.log(req.body);

    var forwardData = transformData(req.header['x-gitlab-event'], req.body);

    console.log('Forward Data:');
    console.log(forwardData);

    res.status(200);
    res.send('OK');
    res.end();

    request({
        url: 'https://discordapp.com/api/webhooks/429916549017763841/-3yqpx7q_5WQV2WmLRJD50HaE5KblxZH7nU93PsTw3PMPQ6kmV0i2bIFOT0bHOsjQDMz',
        method: 'POST',
        json: true,
        body: forwardData
    }, function(error, resp, body) {
        console.log('Discord Response');
        console.log(error);
        console.log(body);
    });
});

app.listen(PORT, () => console.log(`Gitlab Discord Transformer listening on port ${PORT}`));

function transformData(type, body) {
    var forwardData = null;
    if(type === 'Push Hook') {
        // 'https://git.ece.iastate.edu/sd/sdmay18-09'
        // 'https://git.ece.iastate.edu/sd/sdmay18-09/compare/4c49fcd9aab890a0563752363bab69031436c456...4f52b4d4e9da834ce238330ff965ffd9c37ef07a'
        // 'https://git.ece.iastate.edu/sd/sdmay18-09/commits/issue_5'
        var content_str = `${body.user_username} pushed to branch ${body.ref} of ${body.project.name} (compare changes)`
        var embed_msg = '';
        for(var commit in body.project.commits) {
            embed_msg += `${commit.id} by <author>\n${commit.message}\n\n`;
        }
        embeds = [
            {
                description: embed_msg,
                type: 'rich',
            }
        ];
        forwardData = {
            content: content_str,
            username: 'gitlab-bot',
            avatar_url: `https://${req.headers.host}/images/gitlab-logo.png`,
            tts: false,
            embeds: embeds
        }
    } else {
        forwardData = {
            content: "gitlab sent a message!",
            username: "gitlab-bot",
            avatar_url: `https://${req.headers.host}/images/gitlab-logo.png`,
            tts: false,
            embeds: [
                {
                    title: "Embedded Message",
                    description: "Gitlab event",
                    type: "rich",
                    footer: {
                        text: "footer text",
                    }
                },
            ]
        }
    }

    return forwardData;
}
