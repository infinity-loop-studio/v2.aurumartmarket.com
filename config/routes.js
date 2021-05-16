module.exports.routes = {
  '/': async (req, res) => {
    res.redirect('/ru');
  },
  '/ru': 'PageController.getPage',
  '/ru/:page': 'PageController.getPage',
  '/ru/lessons/:product': 'PageController.getLesson',
  '/ru/courses/:product': 'PageController.getCourse',

  '/add': 'SystemController.add',
  '/recaptchaTokenVerify': 'SystemController.recaptchaTokenVerify',
  '/registerCustomer': 'SystemController.registerCustomer',
  '/loginCustomer': 'SystemController.loginCustomer',
  '/customer/logout': 'SystemController.customerLogout',
  '/mail/activation/:email/:activationCode': 'SystemController.mailActivation',
  '/pay': 'SystemController.pay',

  '/ru/customer': 'CustomerController.dashboard',
  '/ru/customer/orders': 'CustomerController.orders',

  '/test': 'TestController.getCurrency',
  '/restart': 'TestController.restart',
  '/sendEmail': 'TestController.sendEmail',
  '/merchantOrderSignature': 'TestController.merchantOrderSignature',
  '/wfp': 'TestController.wfp',

  '/ru/dashboard': 'DashboardController.index'
};
