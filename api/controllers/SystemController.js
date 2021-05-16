module.exports = {
  recaptchaTokenVerify: async (req, res) => {
    if (req.xhr) {
      const axios = require('axios');
      var allParams = req.allParams();
      let result = await axios({
        method: 'post',
        url: 'https://www.google.com/recaptcha/api/siteverify',
        params: {
          secret: '6Lct1mYaAAAAAHDG6CDaSaTpnKaAKMSrORwGbGoW',
          response: req.param('token'),
          ip: req.ip
        }
      });
      return res.json(result.data);
    } else {
      return res.redirect('/');
    }
  },
  registerCustomer: async (req, res) => {

    /* MODULES */
    const md5 = require('md5');
    const nodemailer = require('nodemailer');
    const crypto = require('crypto');

    /* GENERATING ACTIVATION CODE*/
    let token = md5('aurumartmarket.com;CiscoVA!%9000');
    let hmac = crypto.createHmac('md5', token);
    let string = hmac.update(req.param('name') + ';' + req.param('email') + ';' + req.param('phone') + ';' + req.param('password'));
    let activationCode = string.digest('hex');

    if (req.xhr) {

      /* CUSTOMER FIND OR CREATE */
      Customers.findOrCreate({email: req.param('email')}, {
        name: req.param('name'),
        email: req.param('email'),
        phone: req.param('phone'),
        password: md5(req.param('password')),
        activationCode: activationCode
      }).exec(async (err, customer, wasCreated) => {

        if (err) {
          return res.serverError(err);
        }

        /**//*-->*/
        if (wasCreated) {
          let transporter = nodemailer.createTransport({
            host: 'smtp-pulse.com',
            port: 2525,
            auth: {
              user: 'aurum2009@gmail.com',
              pass: 'nN2ZQZZBLHc4'
            }
          });

          let letter = {
            from: 'AURUM | Активация no-reply@aurumartmarket.com',
            to: req.param('email'),
            subject: 'AURUM ART MARKET | Активация учётной записи',
            html: '' +
              '<p>Пожалуйста подтвердите ваш адрес электронной почты, нажав ссылку расположенную ниже.</p>' +
              '<p><a href="https://v2.aurumartmarket.com/mail/activation/' + req.param('email') + '/' + activationCode + '">Подтвердить E-mail</a></p>'
          };

          transporter.sendMail(letter, (error, info) => {
            if (error) {
              return console.log(error.message);
            }
            console.log('Message sent: %s', info.messageId);
          });

          /* WRITE TO SESSION */
          req.session.loggedIn = true;
          req.session.customerId = customer.id;
          req.session.customerName = customer.name;
          req.session.customerEmail = customer.email;
          return res.json({exist: false});

        } else {
          return res.json({exist: true});
        }
        /**//*-->*/
      });
    } else {
      return res.redirect('/');
    }
  },
  loginCustomer: async (req, res) => {
    if (req.xhr) {
      const md5 = require('md5');
      let customer = await Customers.findOne({
        email: req.param('login')
      });
      if (!customer) {
        return res.json({
          user: false
        });
      } else {
        let password = md5(req.param('password'));
        if (password === customer.password) {
          req.session.loggedIn = true;
          req.session.customerId = customer.id;
          req.session.customerName = customer.name;
          req.session.customerEmail = customer.email;
          if (customer.activation) {
            req.session.activation = true;
          }
          return res.json({
            user: true,
            password: true
          });
        } else {
          return res.json({
            user: true,
            password: false
          });
        }
      }
    } else {
      return res.redirect('/');
    }
  },
  customerLogout: async (req, res) => {
    req.session.destroy();
    return res.redirect('/');
  },
  mailActivation: async (req, res) => {
    let customer = await Customers.findOne({
      email: req.param('email'),
      activationCode: req.param('activationCode')
    });
    if (customer) {
      if (customer.activation) {
        return res.redirect('/');
      } else {
        let data = null;
        let cart = {lessons: false, courses: false};

        if (req.cookies.cart) {
          if (req.cookies.cart.lessons.length) {
            var cartLessons = await Lessons.find({
              where: {
                id: req.cookies.cart.lessons
              }
            });
            cart.lessons = cartLessons;
          }
          if (req.cookies.cart.courses.length) {
            /* Courses */
          }
        }

        let updatedUser = await Customers.updateOne({
          email: customer.email,
          activationCode: customer.activationCode
        }).set({
          activation: true
        });

        if (req.session.loggedIn) {
          req.session.activation = true;
        }

        return res.view('pages/thankyoupage', {
          layout: 'layouts/template',
          data: data,
          cart: cart
        });
      }
    } else {
      return res.notFound();
    }
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
    if (req.xhr) {
      if (req.session.loggedIn) {

        /* MODULES */
        var crypto = require('crypto');
        /* MODULES */

        let currencies = await sails.helpers.getCurrencies();
        let currency = '';
        let products = req.cookies.cart;
        let lessons = undefined;
        let courses = undefined;
        let originalAmount = 0;
        let customerAmount = 0;

        let transactionObject = {
          'merchantAccount': 'v2_aurumartmarket_com',
          'merchantDomainName': 'v2.aurumartmarket.com',
          'orderReference': '',
          'orderDate': 0,
          'amount': 0,
          'currency': '',
          'productName': [],
          productCount: [],
          productPrice: [],
          'returnUrl': 'https://v2.aurumartmarket.com',
          'serviceUrl': 'https://v2.aurumartmarket.com/wfp',
        };

        /* CURRENCY */

        if (req.session.currency) {
          currency = req.session.currency;
        } else {
          currency = 'USD';
        }

        /* GET PRODUCTS */

        if (products.lessons.length) {
          lessons = await Lessons.find({
            where: {
              id: products.lessons
            }
          });
          for (let i = 0; i < lessons.length; i++) {
            originalAmount = originalAmount + Number(lessons[i].price);
            transactionObject.productName[i] = lessons[i].name;
            transactionObject.productCount[i] = 1;
            transactionObject.productPrice[i] = Number(lessons[i].price);
          }
        }

        if (products.courses.length) {
          courses = await Courses.find({
            where: {
              id: products.courses
            }
          });
          for (let i = products.lessons.length; i < products.lessons.length + courses.length; i++) {
            originalAmount = originalAmount + Number(courses[i - products.lessons.length].price);
            transactionObject.productName[i] = courses[i - products.lessons.length].name;
            transactionObject.productCount[i] = 1;
            transactionObject.productPrice[i] = Number(courses[i - products.lessons.length].price);
          }
        }

        /* CALCULATE CUSTOMER AMOUNT */

        switch (currency) {
          case 'USD':
            customerAmount = originalAmount;
            break;
          case 'EUR':
            customerAmount = (originalAmount * currencies.USD) / currencies.EUR;
            break;
          case 'RUB':
            customerAmount = (originalAmount * currencies.USD) / currencies.RUB;
            break;
          case 'UAH':
            customerAmount = originalAmount * currencies.USD;
            break;
        }

        let order = await Orders.create({
          customerId: req.session.customerId,
          customerCurency: currency,
          customerProducts: products,
          originalAmount: originalAmount,
          customerAmount: customerAmount
        }).fetch();

        /* SECOND PART */
        let userOrders = await Orders.find({customerId: req.session.customerId});
        transactionObject.orderReference = 'FIRST_TEST_UID' + req.session.customerId + 'O' + Object.keys(userOrders).length + 'T1';
        transactionObject.amount = customerAmount;
        transactionObject.currency = currency;

        let customer = await Customers.findOne({id: req.session.customerId});

        transactionObject.clientFirstName = customer.name;
        transactionObject.clientEmail = customer.email;
        transactionObject.clientPhone = customer.phone;

        /* TRANSACTION CREATOR */
        let transaction = await Transactions.create({
          orderId: order.id,
          orderReference: transactionObject.orderReference,
          amount: transactionObject.amount,
          currency: transactionObject.currency,
          productName: transactionObject.productName,
          productPrice: transactionObject.productPrice,
          clientFirstName: transactionObject.clientFirstName,
          clientEmail: transactionObject.clientEmail,
          clientPhone: transactionObject.clientPhone
        }).fetch();
        /* TRANSACTION CREATOR */

        transactionObject.orderDate = transaction.createdAt;

        /* MERCHANT SIGNATURE GENERATOR */
        let stringForEncription = 'v2_aurumartmarket_com;v2.aurumartmarket.com;' + transaction.orderReference + ';' + transaction.createdAt + ';'+ transaction.amount + ';' + transaction.currency;
        for (let i = 0; i < transaction.productName.length; i++) {
          stringForEncription += ';' + transaction.productName[i];
        }
        for (let i = 0; i < transaction.productName.length; i++) {
          stringForEncription += ';1';
        }
        for (let i = 0; i < transaction.productPrice.length; i++) {
          stringForEncription += ';' + transaction.productPrice[i];
        }
        let hmac = crypto.createHmac('md5', '7789684e6f2c4d0706b7b0c4c7e8bfc98766bcfa');
        let string = hmac.update(stringForEncription);
        let merchantSignature = string.digest('hex');
        transactionObject.merchantSignature = merchantSignature;
        /* MERCHANT SIGNATURE GENERATOR */

        /* SECOND PART */

        return res.json({loggedIn: true, body: transactionObject});
      } else {
        return res.json({loggedIn: false});
      }
    } else {
      return res.redirect('/');
    }
  }
};

