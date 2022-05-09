const querystring = require('querystring');
const AsaasBaseClient = require('./base-client');
const V = require('argument-validator');

class AsaasAccount extends AsaasBaseClient {
    async getBalance() { return this.doRequest('GET', 'finance/balance'); }

    async getPaymentStatistics(params = {}) {
        const  url = `finance/payment/statistics?${querystring.encode(params)}`;
        return this.doRequest('GET', url);
    }
}

module.exports = AsaasAccount;
