const phantom = require('phantom');
const cheerio = require('cheerio');

// From https://github.com/amir20/phantomjs-node/issues/431#issuecomment-207865947
function waitUntil(asyncTest) {
    return new Promise(function (resolve, reject) {
        function wait() {
            asyncTest().then(function (value) {
                if (value === true) {
                    resolve();
                } else {
                    setTimeout(wait, 100);
                }
            }).catch(function (e) {
                console.log('Error found. Rejecting.', e);
                reject();
            });
        }
        wait();
    });
}

function rowToSignal($, row) {
    const header = $(row).find('.ant-row-flex').find('span').find('span');
    const coin = header.first().text();
    const time = header.last().text();
    const bodyRows = $(row).find('.ant-row').find('.ant-row');

    let indicator = bodyRows.first().text();
    indicator = indicator.substring('Indicator: '.length, indicator.length);

    let signal = bodyRows.last().text();
    signal = signal.substring('Signal: '.length, signal.length);

    signal = {
        direction: signal.indexOf('Likelihood of price increase') > -1 ? 'increase' : 'decrease',
        likelihood: signal.substring(signal.length - 4, signal.length).trim(),
    }
    return {
        coin: coin,
        time: time,
        indicator: indicator,
        signal: signal,
    }
}

function getHTMLAISignalsFromContent(content) {
    const $ = cheerio.load(content);
    const rows = $('#ai-signals .ant-card .ant-card-bordered');
    const signals = [];
    rows.each((i,row) => {
        signals.push(rowToSignal($, row));
    })
    return signals;
}

function getAISignals() {
    var _ph, _page, _outObj;
    return phantom
        .create()
        .then(ph => {
            _ph = ph;
            return _ph.createPage();
        })
        .then(page => {
            _page = page;
            return _page.open('https://coinloop.io/');
        })
        .then((page) => {
            return waitUntil(function () {
                return _page.evaluate(function () {
                    return document.querySelectorAll('#ai-signals .ant-card .ant-card-bordered').length > 1;
                })
            })
        })
        .then(() => {
            return _page.property('content');
        })
        .then((content) => {
            return getHTMLAISignalsFromContent(content);
        })
        .then((signals) => {
            _page.close();
            _ph.exit();
            return signals;
        })
        .catch(e => console.log(e));    
}

module.exports = {
    getAISignals,
    rowToSignal
}