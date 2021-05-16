module.exports = {
  friendlyName: 'Get actual currencies',
  description: 'Get actual currencies from Way for pay',
  extendedDescription: 'I have no time to write extended description.',
  exits: {
    success: {
      outputCurrenciesList: 'Currencies list'
    }
  },
  fn: async function (inputs, exits) {
    /* MODULES */
    var https = require('https');
    var crypto = require('crypto');
    var date = Date.now();
    /* MERCHANT SIGNATURE GENERATOR */
    var hmac = crypto.createHmac('md5', '7789684e6f2c4d0706b7b0c4c7e8bfc98766bcfa');
    var string = hmac.update('v2_aurumartmarket_com;' + date);
    var merchantSignature = string.digest('hex');
    /* REQUEST OPTIONS & PARAMS */
    var options = {
      host: 'api.wayforpay.com',
      path: '/api',
      method: 'post'
    };
    let params = {
      'transactionType': 'CURRENCY_RATES',
      'merchantAccount': 'v2_aurumartmarket_com',
      'merchantSignature': merchantSignature,
      'apiVersion': '1',
      'orderDate': date
    };
    /* REQUEST FOR WFP */
    var request = https.request(options, function (response) {
      response.setEncoding('utf8');
      response.on('data', function (chunk) {
        return exits.success(JSON.parse(chunk).rates);
      });
      response.on('end', () => {
      });
    });
    request.on('error', function (e) {
      console.log('problem with request: ' + e.message);
    });
    request.write(JSON.stringify(params));
    request.end();
  }
};
