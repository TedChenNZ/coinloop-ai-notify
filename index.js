const email = require('./utils/email.js');
const coinloop = require('./utils/coinloop.js');
const CronJob = require('cron').CronJob;
const equal = require('deep-equal');
const fs = require('fs');
const path = require('path');

let config;
let latestSignal;

function areSignalsEqual(s1, s2) {
    delete s1.time;
    delete s2.time;
    return equal(s1, s2);
}

function getLatestSignal() {
    return coinloop.getAISignals().then((signals) => {
        if (signals && signals.length) {
            latestSignal = signals[0];
        }
        return latestSignal;
    });
}

function generateEmail(signal) {
    return {
        subject: 'Coinloop AI Signal: ' + signal.coin + ' ' + signal.signal.direction + ' ' + signal.signal.likelihood,
        text: signal.indicator
    }
}

function readConfig() {
    return fs.readFileSync(path.join(__dirname, './config.json'), 'utf8');
}

function startCronjob() {
    console.log('Starting cronjob');
    return new CronJob('*/5 * * * *', function () {
        let veryLatest = getLatestSignal().then(signal => {
            const newSignal = !areSignalsEqual(latestSignal, veryLatest);
            if (newSignal) {
                latestSignal = newSignal;
                console.log('New signal');
                console.log(latestSignal);
                const emailParameters = generateEmail(latestSignal);
                email(config.recipients, emailParameters.subject, emailParameters.text);
            }
        }).catch(err => console.err(err));
    }, null, true, 'Pacific/Auckland');
}

function main() {
    const startTime = Date.now();
    console.log('Started at ' + startTime);
    config = readConfig();

    let cron;
    getLatestSignal().then((latestSignal) => {
        cron = startCronjob();
    })
}

main();