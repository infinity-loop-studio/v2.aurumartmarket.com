module.exports = {
  attributes: {
    name: {type: 'string', required: true},
    email: {type: 'string', required: true},
    phone: {type: 'string', required: true},
    password: {type: 'string', required: true},
    activation: {type: 'boolean', defaultsTo: false},
    activationCode: {type: 'string'}
  }
};

