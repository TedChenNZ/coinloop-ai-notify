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

function getAISignals(content) {
    const $ = cheerio.load(content);
    const rows = $('#ai-signals .ant-card .ant-card-bordered');
    const signals = [];
    rows.each((i,row) => {
        signals.push(($(row).text()));
    })
    return signals;
}

function coinloop() {
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
            return getAISignals(content);
        })
        .then((signals) => {
            _page.close();
            _ph.exit();
            return signals;
        })
        .catch(e => console.log(e));    
}

module.exports = coinloop;