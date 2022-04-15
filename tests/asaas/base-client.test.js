require('../test-helper');

const assert = require('assert');
const AsaasBaseClient = require('../../core/asaas/base-client');

describe('Asaas Payment', () => {
    const { TEST_ASAAS_TOKEN } = process.env;

    it('initialize client', () => {
        const client = new AsaasBaseClient(TEST_ASAAS_TOKEN, 'sandbox');

        assert(client.env === 'sandbox');
        assert(client.accessToken === TEST_ASAAS_TOKEN);
        assert(/sandbox\.asaas/.test(client.config.baseUrl));
    });

    it('tests doRequest to finacne/balance', async() => {
        const client = new AsaasBaseClient(TEST_ASAAS_TOKEN, 'sandbox');
        const res = await client.doRequest('GET', 'finance/balance');

        assert(res);
        assert(typeof res.balance !== 'undefined');
        assert(res.balance >= 0);

        assert(client.lastRequest);
        assert(client.lastResponse);

        assert(client.lastRequest.headers);
        assert(client.lastRequest.url);

        assert(client.lastResponse.headers);
        assert(client.lastResponse.body);
    });
});
