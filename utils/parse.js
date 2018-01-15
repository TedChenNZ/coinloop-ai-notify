const fs = require('fs');
const path = require('path');
const equal = require('deep-equal');
const email = require('./email.js');

function areSignalsEqual(s1, s2) {
    delete s1.time;
    delete s2.time;
    return equal(s1, s2);
}

function generateEmail(signal) {
    return {
        subject: 'Coinloop AI Signal: ' + signal.coin + ' ' + signal.signal.direction + ' ' + signal.signal.likelihood,
        text: signal.indicator
    }
}

function readConfig() {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8'));
}

function parseSignal(latestSignal, signal, sendEmail = true) {
    if (!areSignalsEqual(latestSignal, signal)) {
        console.log('New signal');
        console.log(JSON.stringify(signal));
        if (sendEmail) {
            const config = readConfig();
            const emailParameters = generateEmail(signal);
            email(config.recipients, emailParameters.subject, emailParameters.text);
        }
        return true;
    }
    console.log('No new signal found');
    return false;
}

module.exports = {
    parseSignal,
    readConfig
}
