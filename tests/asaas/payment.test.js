require('../test-helper');

const assert = require('assert');
const { addDays, format: formatDate } = require('date-fns');

const PaymentClient = require('../../core/asaas/payment');
const CustomerClient = require('../../core/asaas/customer');

describe('Payment Asaas', () => {
    const { TEST_ASAAS_TOKEN } = process.env;
    const customers = [ ];

    after(async () => {
        const client = new CustomerClient(TEST_ASAAS_TOKEN, 'sandbox');
        for (const id of customers) { await client.remove(id); }
    });

    it('create payment boleto', async () => {
        const customerClient = new CustomerClient(TEST_ASAAS_TOKEN, 'sandbox');
        const paymentClient = new PaymentClient(TEST_ASAAS_TOKEN, 'sandbox');

        const customer = await customerClient.create({
            name: 'Deividy Metheler Zachetti',
            cpfCnpj: 38934783885
        });

        customers.push(customer.id);

        const paymentResponse = await paymentClient.create(
            customer.id,
            'boleto',
            {
                dueDate: formatDate(addDays(new Date(), 1), 'yyyy-MM-dd'),
                value: 100
            }
        );

        assert(paymentResponse);
        assert(paymentResponse.id);
        assert(paymentResponse.dueDate);
        assert(paymentResponse.fine);
        assert(!paymentResponse.identificationField);
    });

    it('createBillet()', async () => {
        const customerClient = new CustomerClient(TEST_ASAAS_TOKEN, 'sandbox');
        const paymentClient = new PaymentClient(TEST_ASAAS_TOKEN, 'sandbox');

        const customer = await customerClient.create({
            name: 'Deividy Metheler Zachetti',
            cpfCnpj: 38934783885
        });

        const paymentResponse = await paymentClient.createBillet(
            customer.id,
            {
                dueDate: formatDate(addDays(new Date(), 1), 'yyyy-MM-dd'),
                value: 100
            }
        );

        assert(paymentResponse);
        assert(paymentResponse.identificationField);
        assert(paymentResponse.id);
        assert(paymentResponse.dueDate);
        assert(paymentResponse.fine);
    });

    it('createPix()', async () => {
        const customerClient = new CustomerClient(TEST_ASAAS_TOKEN, 'sandbox');
        const paymentClient = new PaymentClient(TEST_ASAAS_TOKEN, 'sandbox');

        const customer = await customerClient.create({
            name: 'Deividy Metheler Zachetti',
            cpfCnpj: 38934783885
        });

        const paymentResponse = await paymentClient.createPix(
            customer.id,
            {
                dueDate: formatDate(addDays(new Date(), 1), 'yyyy-MM-dd'),
                value: 100
            }
        );

        assert(paymentResponse);
        assert(paymentResponse.id);
        assert(paymentResponse.dueDate);
        assert(paymentResponse.fine);
    });

    it('pay()', async () => {
        const customerClient = new CustomerClient(TEST_ASAAS_TOKEN, 'sandbox');
        const paymentClient = new PaymentClient(TEST_ASAAS_TOKEN, 'sandbox');

        const customer = await customerClient.create({
            name: 'Deividy Metheler Zachetti',
            cpfCnpj: 38934783885
        });

        const creditCardData = {
            holder: {
            },

            details: {

            }
        };

        const paymentResponse = await paymentClient.pay(
            customer.id,
            creditCardData,
            {
                dueDate: formatDate(addDays(new Date(), 1), 'yyyy-MM-dd'),
                value: 100
            }
        );

        assert(paymentResponse);
        assert(paymentResponse.id);
        assert(paymentResponse.dueDate);
        assert(paymentResponse.fine);
    });
});
