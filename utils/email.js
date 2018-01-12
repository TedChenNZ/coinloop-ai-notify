var nodemailer = require('nodemailer');
var fs = require('fs');
var path = require('path');

function readSecrets() {
    return fs.readFileSync(path.join(__dirname, '../secrets.json'), 'utf8');
}

const secrets = JSON.parse(readSecrets());

function email(recipients, subject, message) {
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
            return err;
        }
        if (info) {
            if (info.accepted.length && info.rejected.length === 0) {
                console.log('Email sent');
                return info;
            }
        }
        const error = 'An unknown error occurred';
        console.log(error);
        return error;
    });
}

module.exports = email;