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
    // console.log('Headers: ');
    // console.log(req.headers);
    // console.log('Body: ');
    // console.log(req.body);

    var forwardData = transformData(req.headers['x-gitlab-event'], req.headers.host, req.body);

    console.log(`Forward Data for type: ${req.headers['x-gitlab-event']}`);
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
        // console.log('Discord Response');
        // console.log(error);
        // console.log(body);
    });
});

app.listen(PORT, () => console.log(`Gitlab Discord Transformer listening on port ${PORT}`));

function transformData(type, host, body) {
    var forwardData = null;
    if(type === 'Push Hook') {
        var branch = transformRef(body.ref);
        var content_str = `${body.user_username} pushed to branch [${branch}](${body.project.web_url}/commits/${branch}) of [${body.project.name}](${body.project.web_url}) ([Compare Changes](${body.project.web_url}/compare/${body.before}...${body.after}))`
        var embed_msg = '';
        body.commits.forEach(function(commit) {
            embed_msg += `[${commit.id.substring(0, 7)}](${commit.url}) by ${commit.author.name}\n${commit.message}\n\n`;
        });
        embeds = [
            {
                description: embed_msg,
                type: 'rich',
            }
        ];
        forwardData = {
            content: content_str,
            username: 'gitlab-bot',
            avatar_url: `https://${host}/images/gitlab-logo.png`,
            tts: false,
            embeds: embeds
        }
    } else {
        forwardData = {
            content: "gitlab sent a message!",
            username: "gitlab-bot",
            avatar_url: `https://${host}/images/gitlab-logo.png`,
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

function transformRef(ref) {
    return ref.replace(/refs\/heads\//, '');
}
