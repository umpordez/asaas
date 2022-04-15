require('../test-helper');

const assert = require('assert');
const CustomerClient = require('../../core/asaas/customer');

describe('Asaas Payment', () => {
    const { TEST_ASAAS_TOKEN } = process.env;
    const customers = [ ];

    after(async () => {
        const client = new CustomerClient(TEST_ASAAS_TOKEN, 'sandbox');
        for (const id of customers) { await client.remove(id); }
    });

    it('initialize client', () => {
        const client = new CustomerClient(TEST_ASAAS_TOKEN, 'sandbox');

        assert(client.env === 'sandbox');
        assert(client.accessToken === TEST_ASAAS_TOKEN);
        assert(/sandbox\.asaas/.test(client.config.baseUrl));
    });

    it('tests doRequest to finacne/balance', async() => {
        const client = new CustomerClient(TEST_ASAAS_TOKEN, 'sandbox');

        const customer = await client.create({
            name: 'Deividy Metheler Zachetti',
            cpfCnpj: 38934783885,
            email: 'deividyz@gmail.com',
            phone: '1936041534',
            mobilePhone: '19992804294',
            address: 'Rua Padre Manoel da Nobrega',
            addressNumber: 501,
            complement: 'Proximo ao Senac',
            province: 'Vila Santa Catarina',
            postalCode: '13466321',
            externalReference: 'TEST_01',
            additionalEmails: 'email@deividy.com, sensei@isei.app',
            municipalInscription: 463199017,
            observation: 'Some test',
            groupName: 'iSei clients',
            notificationDisabled: true
        });

        customers.push(customer.id);
    });

    it('list clients', async () => {
        const client = new CustomerClient(TEST_ASAAS_TOKEN, 'sandbox');
        const customer = await client.create({
            name: 'Deividy Metheler Zachetti',
            cpfCnpj: 38934783885
        });

        customers.push(customer.id);
        const listCustomers = await client.list();

        assert(listCustomers);
        assert(listCustomers.data.length >= 1);
    });

    it('get / update customer', async () => {
        const client = new CustomerClient(TEST_ASAAS_TOKEN, 'sandbox');
        const customer = await client.create({
            name: 'Deividy Metheler Zachetti',
            cpfCnpj: 38934783885
        });

        customers.push(customer.id);

        const customerOnAsaas = await client.get(customer.id);
        assert(!customerOnAsaas.email);

        await client.update(customer.id, {
            email: 'deividyz@gmail.com',
            phone: '1936041534',
            groupName: 'iSei clients',
            notificationDisabled: true
        });

        const customerOnAsaas2 = await client.get(customer.id);
        assert(customerOnAsaas2.email === 'deividyz@gmail.com');
    });
});
