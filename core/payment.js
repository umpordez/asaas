const AsaasBaseClient = require('./base-client');
const V = require('argument-validator');

class AsaasPayment extends AsaasBaseClient {
    async create(customerId, paymentType, paymentData = {}) {
        V.string(customerId, 'customerId');
        V.string(paymentType, 'paymentType');
        V.object(paymentData, 'paymentData');
        V.number(paymentData.value, 'paymentData.value');

        if (!paymentData.installmentValue) {
            if (paymentData.installmentCount > 1) {
                paymentData.totalValue = paymentData.value;
            } else {
                delete paymentData.installmentCount;
            }
        }

        V.string(paymentData.dueDate, 'paymentData.dueDate');

        paymentData.customer = customerId;
        paymentData.billingType = paymentType.toUpperCase();

        return this.doRequest(
            'POST',
            'payments',
            paymentData
        );
    }

    async qrCode(addressKey, value, description) {
        V.string(addressKey, 'addressKey');
        V.number(value, 'value');

        V.string(description, 'description');
        return this.doRequest(
            'POST',
            'pix/qrCodes/static',
            { addressKey, value, description }
        );
    }

    async refund(paymentId) {
        return this.doRequest('POST', `payments/${paymentId}/refund`);
    }

    async refundInstallments(installmentIds) {
        const responses = [ ];
        const requests = [];

        for (const id of installmentIds) {
            await this.doRequest('POST', `installments/${id}/refund`);

            requests.push(this.lastRequest);
            responses.push(this.lastResponse);
        }

        this.lastRequest = requests;
        this.lastResponse = responses;

        return responses;
    }

    async getInstallments(installmentId) {
        const installmentResponse = await this.doRequest(
            'GET',
            `payments?installment=${installmentId}`
        );

        return installmentResponse;
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

        const { token, details, holder } = creditCardData;
        if (token) {
            V.string(token, 'token');
            paymentData.creditCardToken = token;
        } else {
            V.object(details, 'details');
            V.object(holder, 'holder');

            paymentData.creditCard = {
                holderName: holder.name,
                ...details
            };

            paymentData.creditCardHolderInfo = { ...holder };
        }

        const paymentResponse = await this.create(
            customerId,
            'CREDIT_CARD',
            paymentData
        );

        return paymentResponse;
    }
}

module.exports = AsaasPayment;
