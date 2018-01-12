const CronJob = require('cron').CronJob;
const coinloop = require('./utils/coinloop.js');
const parse = require('./utils/parse.js');

let latestSignal;

function getLatestSignal() {
    return coinloop.getAISignals().then((signals) => {
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
            parse.parseSignal(latestSignal, signal);
            latestSignal = signal;
        }).catch(err => console.err(err));
    }, null, true, 'Pacific/Auckland');
}

function main() {
    const startTime = Date.now();
    console.log('Started at ' + startTime);

    let cron;
    getLatestSignal().then((signal) => {
        latestSignal = signal;
        cron = startCronjob();
    })
}

main();