module.exports = {
  attributes: {
    merchantAccount: {type: 'string', allowNull: true},
    orderReference: {type: 'string', allowNull: true},
    merchantSignature: {type: 'string', allowNull: true},
    amount: {type: 'string', allowNull: true},
    currency: {type: 'string', allowNull: true},
    authCode: {type: 'string', allowNull: true},
    email: {type: 'string', allowNull: true},
    phone: {type: 'string', allowNull: true},
    createdDate: {type: 'string', allowNull: true},
    processingDate: {type: 'string', allowNull: true},
    cardPan: {type: 'string', allowNull: true},
    cardType: {type: 'string', allowNull: true},
    issuerBankCountry: {type: 'string', allowNull: true},
    issuerBankName: {type: 'string', allowNull: true},
    recToken: {type: 'string', allowNull: true},
    transactionStatus: {type: 'string', allowNull: true},
    reason: {type: 'string', allowNull: true},
    reasonCode: {type: 'string', allowNull: true},
    fee: {type: 'string', allowNull: true},
    paymentSystem: {type: 'string', allowNull: true},
    acquirerBankName: {type: 'string', allowNull: true},
    cardProduct: {type: 'string', allowNull: true},
    clientName: {type: 'string', allowNull: true},
    baseAmount: {type: 'string', allowNull: true},
    baseCurrency: {type: 'string', allowNull: true}
  }
};

