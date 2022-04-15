const AsaasBaseClient = require('./base-client');
const V = require('argument-validator');

class AsaasPayment extends AsaasBaseClient {
    async create(customerId, paymentType, paymentData = {}) {
        V.string(customerId, 'customerId');
        V.string(paymentType, 'paymentType');
        V.object(paymentData, 'paymentData');

        V.number(paymentData.value, 'paymentData.value');
        V.string(paymentData.dueDate, 'paymentData.dueDate');

        paymentData.customer = customerId;
        paymentData.billingType = paymentType.toUpperCase();

        return this.doRequest(
            'POST',
            'payments',
            paymentData
        );
    }

    async createBillet(customerId, paymentData) {
        const paymentResponse = await this.create(
            customerId,
            'BOLETO',
            paymentData
        );

        const billetResponse = await this.doRequest(
            'GET',
            `payments/${paymentResponse.id}/identificationField`
        );

        return { ...paymentResponse, ...billetResponse };
    }

    async createPix(customerId, paymentData) {
        const paymentResponse = await this.create(
            customerId,
            'PIX',
            paymentData
        );

        const pixResponse = await this.doRequest(
            'GET',
            `payments/${paymentResponse.id}/pixQrCode`
        );

        return { ...paymentResponse, ...pixResponse };
    }

    async pay(customerId, creditCardData, paymentData) {
        V.number(paymentData.installmentCount, 'installmentCount');

        const paymentResponse = await this.create(
            customerId,
            'CREDIT_CARD',
            paymentData
        );

    }
}

module.exports = AsaasPayment;
