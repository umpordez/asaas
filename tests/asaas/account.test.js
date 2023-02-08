require('../test-helper');

const assert = require('assert');
const AccountClient = require('../../core/account');

describe('Asaas Payment', () => {
    const { TEST_ASAAS_TOKEN } = process.env;

    it('initialize client', () => {
        const client = new AccountClient(TEST_ASAAS_TOKEN, 'sandbox');

        assert(client.env === 'sandbox');
        assert(client.accessToken === TEST_ASAAS_TOKEN);
        assert(/sandbox\.asaas/.test(client.config.baseUrl));
    });

    it('getBalance', async () => {
        const client = new AccountClient(TEST_ASAAS_TOKEN, 'sandbox');
        const res = await client.getBalance();

        assert(res && res.balance >= 0);
    });

    it('getPaymentStatistics pending', async () => {
        const client = new AccountClient(TEST_ASAAS_TOKEN, 'sandbox');
        const { quantity, value, netValue } = await client
            .getPaymentStatistics({ status: 'PENDING' });

        assert(quantity >= 0);
        assert(value >= 0);
        assert(netValue >= 0);
    });

    it('getPaymentStatistics RECEIVED', async () => {
        const client = new AccountClient(TEST_ASAAS_TOKEN, 'sandbox');
        const { quantity, value, netValue } = await client
            .getPaymentStatistics({ status: 'RECEIVED' });

        assert(quantity >= 0);
        assert(value >= 0);
        assert(netValue >= 0);
    });

    it('create account', async () => {
        const client = new AccountClient(TEST_ASAAS_TOKEN, 'sandbox');
        const res = await client.create({
            name: "Conta criada via API",
            email: "foo@foo.com",
            cpfCnpj: "111111111111",
            companyType: "MEI",
            phone: "19999999999",
            mobilePhone: "19999999999",
            address: "Av. Rolf Wiest",
            addressNumber: "277",
            complement: "Sala 502",
            province: "Bom Retiro",
            postalCode: "89223005",
            accountStatusWebhook: {
                url: "http://localhost:3000/webhook/accountStatus",
                email: "marcelo.almeida@gmail.com",
                interrupted: false,
                enabled: true,
                apiVersion: 3,
                authToken: "5tLxsL6uoN"
            },
            transferWebhook: {
                url: "http://localhost:3000/webhook/transfers",
                email: "marcelo.almeida@gmail.com",
                interrupted: false,
                enabled: true,
                apiVersion: 3,
                authToken: "5tLxsL6uoN"
            },
            paymentWebhook: {
                url: "http://localhost:3000/webhook/payments",
                email: "marcelo.almeida@gmail.com",
                interrupted: false,
                enabled: true,
                apiVersion: 3,
                authToken: "5tLxsL6uoN"
            },
            invoiceWebhook: {
                url: "http://localhost:3000/webhook/invoices",
                email: "marcelo.almeida@gmail.com",
                interrupted: false,
                enabled: true,
                apiVersion: 3,
                authToken: "5tLxsL6uoN"
            }

        });

        assert(res);
        assert(res.object);
        assert(res.id);
        assert(res.name);
    });

});
