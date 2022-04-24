const AsaasCustomer = require('./core/customer');
const AsaasPayment = require('./core/payment');

class Asaas {
    constructor(token, env = 'sandbox') {
        this.customer = () => new AsaasCustomer(token, env);
        this.payment = () => new AsaasPayment(token, env);
    }
}

module.exports = Asaas;

