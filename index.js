const AsaasCustomer = require('./core/customer');
const AsaasPayment = require('./core/payment');
const AsaaAccount = require('./core/account');

class Asaas {
    constructor(token, env = 'sandbox') {
        this.customer = () => new AsaasCustomer(token, env);
        this.payment = () => new AsaasPayment(token, env);
        this.account = () => new AsaasAccount(token, env);
    }
}

module.exports = Asaas;

