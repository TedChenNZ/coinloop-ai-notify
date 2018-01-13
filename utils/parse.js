const fs = require('fs');
const path = require('path');
const equal = require('deep-equal');
const email = require('./email.js');


function readConfig() {
    return fs.readFileSync(path.join(__dirname, '../config.json'), 'utf8');
}

let config = readConfig();

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

function parseSignal(latestSignal, signal, sendEmail = true) {
    if (!areSignalsEqual(latestSignal, signal)) {
        console.log('New signal');
        console.log(JSON.stringify(signal));
        if (sendEmail) {
            const emailParameters = generateEmail(latestSignal);
            email(config.recipients, emailParameters.subject, emailParameters.text);
        }
        return true;
    }
    console.log('No new signal found');
    return false;
}

module.exports = {
    parseSignal
}