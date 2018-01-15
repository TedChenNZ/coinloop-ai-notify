const CronJob = require('cron').CronJob;
const getAISignals = require('./utils/coinloop.js').getAISignals;
const parseSignal = require('./utils/parse.js').parseSignal;
const email = require('./utils/email.js');
const fs = require('fs');
const path = require('path');

let latestSignal;

function getLatestSignal() {
    return getAISignals().then((signals) => {
        if (signals && signals.length) {
            return signals[0];
        }
        console.error("Could not find any signals");
        return latestSignal;
    });
}


function startCronjob() {
    console.log('Starting cronjob');
    return new CronJob('*/1 * * * *', function () {
        getLatestSignal().then(signal => {
            parseSignal(latestSignal, signal);
            latestSignal = signal;
        }).catch(err => console.error(err));
    }, null, true, 'Pacific/Auckland');
}

function main() {
    const startTime = Date.now();
    console.log('Started at ' + startTime);

    let cron;
    getLatestSignal().then((signal) => {
        latestSignal = signal;
        console.log('Latest signal: ' + JSON.stringify(latestSignal));
        cron = startCronjob();
    })
}

main();