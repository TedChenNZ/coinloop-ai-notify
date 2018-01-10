var email = require('./utils/email.js');
var coinloop = require('./utils/coinloop.js');

// email(['tedchennz@gmail.com'], 'Test', 'Body');

coinloop().then((signals) => {
    console.log(signals);
});