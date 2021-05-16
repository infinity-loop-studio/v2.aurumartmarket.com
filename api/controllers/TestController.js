module.exports = {
  getCurrency: async (req, res) => {
    /*var string = hmac.update('v2_aurumartmarket_com;v2.aurumartmarket.com;test_order_reference_1;1614068178;0.02;USD;test1;test2;1;1;0.01;0.01');*/
  },
  restart: async (req, res) => {
    const {exec} = require('child_process');

    exec('forever restartall', (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
    return res.ok();
  },
  add: async (req, res) => {
    if (req.xhr) {
      if (Number(req.param('cart'))) {
        if (!req.cookies.cart) {
          var cart = {
            lessons: [],
            courses: []
          };
        }
        switch (req.param('type')) {
          case 'lesson':
            if (!req.cookies.cart) {
              cart.lessons.push(req.param('id'));
              res.cookie('cart', cart);
              return res.ok();
            } else {
              req.cookies.cart.lessons.push(req.param('id'));
              res.cookie('cart', req.cookies.cart);
              return res.ok();
            }
            break;
          case 'course':
            if (!req.cookies.cart) {
              cart.courses.push(req.param('id'));
              res.cookie('cart', cart);
              return res.ok();
            } else {
              req.cookies.cart.courses.push(req.param('id'));
              res.cookie('cart', req.cookies.cart);
              return res.ok();
            }
            break;
        }
      }
    }
    return res.redirect('/');
  },
  pay: async (req, res) => {
    return res.ok();
    var date = Date.now();
    let string = '';
    let orderObject = {
      'merchantAccount': 'v2_aurumartmarket_com',
      'merchantDomainName': 'v2.aurumartmarket.com',
      'returnUrl': 'https://v2.aurumartmarket.com',
      'serviceUrl': 'https://v2.aurumartmarket.com/callback',
      'orderReference': 'test_order_reference_1',
      'amount': 0.02,
      'currency': 'USD',
      'productName': ['test1', 'test2'],
      'productPrice': [0.01, 0.01],
      'productCount': [1, 1],
      'clientFirstName': 'John',
      'clientLastName': 'Dou',
      'orderDate': 1614068178,
      'clientEmail': 'john.dou@gmail.com',
      'clientPhone': '+12025550152',
      'merchantSignature': '29a6ff154a17587ff2608ec05e457c5e'
    };
    let products = [];
    let amount = 0;
    let lessonsQty = 0;

    string += 'v2_aurumartmarket_com;';
    string += 'v2.aurumartmarket.com;';
    string += 'test_order_reference_2;';
    string += date + ';';

    if (req.cookies.cart.lessons.length) {
      for (let i = 0; i < req.cookies.cart.lessons.length; i++) {
        lesson = await Lessons.findOne({id: req.cookies.cart.lessons[i]});
        products[i] = lesson;
        amount = amount + Number(lesson.price);
        lessonsQty++;
      }
    }
    if (req.cookies.cart.courses.length) {
      for (let i = 0; i < req.cookies.cart.courses.length; i++) {
        course = await Courses.findOne({id: req.cookies.cart.courses[i]});
        products[i + lessonsQty] = product;
        amount = amount + Number(product.price);
      }
    }
    string += amount + ';';
    string += 'USD;';
    for (let i = 0; i < products.length; i++) {
      string += products[i].name + ';';
    }
    for (let i; i < products.length; i++) {
      string += '1;';
    }
    for (let i = 0; i < products.length; i++) {
      string += '1;';
    }
    for (let i = 0; i < products.length; i++) {
      if (i + 1 === products.length) {
        string += products[i].price;
      } else {
        string += products[i].price + ';';
      }
    }
    return res.json(string);
  },
  recaptcha: async (req, res) => {
    const axios = require('axios');
    var allParams = req.allParams();
    let result = await axios({
      method: 'post',
      url: 'https://www.google.com/recaptcha/api/siteverify',
      params: {
        secret: '6Lct1mYaAAAAAHDG6CDaSaTpnKaAKMSrORwGbGoW',
        response: allParams['g-recaptcha-response']
      }
    });
    return res.ok();
  },
  sendEmail: async (req, res) => {

    const nodemailer = require('nodemailer');

    let transporter = nodemailer.createTransport({
      host: 'smtp-pulse.com', // <= your smtp server here
      port: 2525, // <= connection port
      // secure: true, // use SSL or not
      auth: {
        user: 'aurum2009@gmail.com', // <= smtp login user
        pass: 'nN2ZQZZBLHc4' // <= smtp login pass
      }
    });

    let mailOptions = {
      from: 'AURUM | Активация no-reply@aurumartmarket.com', // <= should be verified and accepted by service provider. ex. 'youremail@gmail.com'
      to: 'my.infinityloop.studio@gmail.com', // <= recepient email address. ex. 'friendemail@gmail.com'
      subject: 'AURUM ART MARKET | Активация учётной записи', // <= email subject ex. 'Test email'
      html: '' +
        '<p>Пожалуйста подтвердите ваш адрес электронной почты, нажав ссылку расположенную ниже.</p>' +
        '<p><a href="https://v2.aurumartmarket.com/mail/activation/my.infinityloop.studio@gmail.com/token">Подтвердить E-mail</a></p>'
    };

// send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error.message);
      }
      console.log('Message sent: %s', info.messageId);
    });

    return res.ok();
  },
  wfp: async (req, res) => {
    for (const [key] of Object.entries(req.body)) {
      var wfpRequest = JSON.parse(key);
    }
    console.log(wfpRequest);

    await Wfprequests.create({
      merchantAccount: wfpRequest.merchantAccount,
      orderReference: wfpRequest.orderReference,
      merchantSignature: wfpRequest.merchantSignature,
      amount: wfpRequest.amount,
      currency: wfpRequest.currency,
      authCode: wfpRequest.authCode,
      email: wfpRequest.email,
      phone: wfpRequest.phone,
      createdDate: wfpRequest.createdDate,
      processingDate: wfpRequest.processingDate,
      cardPan: wfpRequest.cardPan,
      cardType: wfpRequest.cardType,
      issuerBankCountry: wfpRequest.issuerBankCountry,
      issuerBankName: wfpRequest.issuerBankName,
      recToken: wfpRequest.recToken,
      transactionStatus: wfpRequest.transactionStatus,
      reason: wfpRequest.reason,
      reasonCode: wfpRequest.reasonCode,
      fee: wfpRequest.fee,
      paymentSystem: wfpRequest.paymentSystem,
      acquirerBankName: wfpRequest.acquirerBankName,
      cardProduct: wfpRequest.cardProduct,
      clientName: wfpRequest.clientName,
      baseAmount: wfpRequest.baseAmount,
      baseCurrency: wfpRequest.baseCurrency,
    });

    let transaction = await Transactions.findOne({
      orderReference: wfpRequest.orderReference
    });

    if (transaction) {
      let order = await Orders.updateOne({
        id: transaction.orderId
      }).set({
        orderStatus: wfpRequest.transactionStatus
      });

      if (wfpRequest.transactionStatus === 'Approved') {

        for (let i = 0; i < order.customerProducts.lessons.length; i++) {
          await CustomerToProducts.create({
            product_type: 'lesson',
            product_id: order.customerProducts.lessons[i],
            customer_id: order.customerId
          });
        }

        for (let i = 0; i < order.customerProducts.courses.length; i++) {
          await CustomerToProducts.create({
            product_type: 'course',
            product_id: order.customerProducts.courses[i],
            customer_id: order.customerId
          });
        }
      }

      /* MERCHANT SIGNATURE GENERATOR */
      var crypto = require('crypto');
      var hmac = crypto.createHmac('md5', '7789684e6f2c4d0706b7b0c4c7e8bfc98766bcfa');
      var string = hmac.update(transaction.orderReference + ';accept;' + transaction.createdAt);
      var signature = string.digest('hex');

      return res.json({
        'orderReference': transaction.orderReference,
        'status': 'accept',
        'time': transaction.createdAt,
        'signature': signature
      });

    } else {
      return res.json({
        'orderReference': 'DH783023',
        'status': 'accept',
        'time': 1415379863,
        'signature': ''
      });
    }
  },
  merchantOrderSignature: async (req, res) => {

    /* MODULES */
    var https = require('https');
    var crypto = require('crypto');
    var date = Date.now();

    /* MERCHANT SIGNATURE GENERATOR */
    var hmac = crypto.createHmac('md5', '7789684e6f2c4d0706b7b0c4c7e8bfc98766bcfa');
    var string = hmac.update('v2_aurumartmarket_com;v2.aurumartmarket.com;test_order_reference_5;1614068178;0.02;UAH;test1;test2;1;1;0.01;0.01');
    var merchantSignature = string.digest('hex');
    return res.json(merchantSignature);
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

