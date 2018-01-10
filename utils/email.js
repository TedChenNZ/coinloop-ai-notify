var nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');

function readSecrets() {
    return fs.readFileSync(path.join(__dirname, '../secrets.json'), 'utf8');
}

function email(recipients, subject, message) {
    var secrets = JSON.parse(readSecrets());
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: secrets.email,
            pass: secrets.password
        }
    });

    var options = {
        from: secrets.email,
        to: recipients,
        subject: subject,
        text: message
    };

    transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err);
        }
        if (info) {
            console.log(info);
        }
    });
}

module.exports = email;