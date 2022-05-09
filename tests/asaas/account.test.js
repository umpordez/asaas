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
});
