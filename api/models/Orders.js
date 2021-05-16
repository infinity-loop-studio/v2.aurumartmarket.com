module.exports = {
  attributes: {
    customerId: {type: 'number'},
    customerCurency: {type: 'string'},
    customerProducts: {type: 'json'},
    originalAmount: {type: 'number'},
    customerAmount: {type: 'number'},

    /*discount: {type: 'boolean'},
    discountName: {type: 'string'},
    discountValue: {type: 'string'},

    totalCustomerAmount: {type: 'number'},
    totalOriginalAmount: {type: 'number'},*/

    orderStatus: {type: 'string', defaultsTo: 'WAIT_FOR_KEEP'}
  }
};

