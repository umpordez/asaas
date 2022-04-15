const AsaasBaseClient = require('./base-client');
const V = require('argument-validator');

class AsaasCustomer extends AsaasBaseClient {
    async create(customerData = { }) {
        V.object(customerData, 'customerData');
        V.string(customerData.name, 'name');
        V.notNull(customerData.cpfCnpj, 'cpfCnpj');

        return this.doRequest('POST', 'customers', customerData);
    }

    async remove(customerId) {
        V.string(customerId, 'customerId');
        return this.doRequest('DELETE', `customers/${customerId}`);
    }

    async list(filter = {}) {
        return this.doRequest('GET', 'customers', filter);
    }

    async get(customerId) {
        V.string(customerId, 'customerId');

        return this.doRequest('GET', `customers/${customerId}`);
    }

    async update(customerId, customerData = { }) {
        V.string(customerId, 'customerId');
        V.object(customerData, 'customerData');

        return this.doRequest('POST', `customers/${customerId}`, customerData);
    }
}

module.exports = AsaasCustomer;
