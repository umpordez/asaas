require('../test-helper');

const assert = require('assert');
const { addDays, format: formatDate } = require('date-fns');

const PaymentClient = require('../../core/payment');
const CustomerClient = require('../../core/customer');

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

    it('pay with minimal info', async () => {
        const customerClient = new CustomerClient(TEST_ASAAS_TOKEN, 'sandbox');
        const paymentClient = new PaymentClient(TEST_ASAAS_TOKEN, 'sandbox');

        const customer = await customerClient.create({
            name: 'Deividy Metheler Zachetti',
            cpfCnpj: 38934783885
        });

        const creditCardData = {
            holder: {
                name: 'Deividy M Zachetti',
                email: 'deividyz@gmail.com',
                cpfCnpj: '38934783885',
                postalCode: '13466321',
                addressNumber: '501',
                mobilePhone: '19992804294',
            },

            details: {
                number: '5162306219378829',
                expiryMonth: formatDate(addDays(new Date(), 30), 'MM'),
                expiryYear: formatDate(new Date(), 'yyyy'),
                ccv: '318'
            }
        };

        const paymentResponse = await paymentClient.pay(
            customer.id,
            creditCardData,
            {
                installmentCount: 1,
                dueDate: formatDate(addDays(new Date(), 1), 'yyyy-MM-dd'),
                value: 100
            }
        );

        assert(paymentResponse);
        assert(paymentResponse.creditCard);
        assert(paymentResponse.creditCard.creditCardToken);
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
                name: 'Deividy M Zachetti',
                email: 'deividyz@gmail.com',
                cpfCnpj: '38934783885',
                postalCode: '13466321',
                addressNumber: '501',
                mobilePhone: '19992804294',
            },

            details: {
                number: '5162306219378829',
                expiryMonth: formatDate(addDays(new Date(), 30), 'MM'),
                expiryYear: formatDate(new Date(), 'yyyy'),
                ccv: '318'
            }
        };

        const paymentResponse = await paymentClient.pay(
            customer.id,
            creditCardData,
            {
                installmentCount: 1,
                dueDate: formatDate(addDays(new Date(), 1), 'yyyy-MM-dd'),
                value: 100
            }
        );

        assert(paymentResponse);
        assert(paymentResponse.creditCard);
        assert(paymentResponse.creditCard.creditCardToken);
    });

    it('pay() with installment', async () => {
        const customerClient = new CustomerClient(TEST_ASAAS_TOKEN, 'sandbox');
        const paymentClient = new PaymentClient(TEST_ASAAS_TOKEN, 'sandbox');

        const customer = await customerClient.create({
            name: 'Deividy Metheler Zachetti',
            cpfCnpj: 38934783885
        });

        const creditCardData = {
            holder: {
                name: 'Deividy M Zachetti',
                email: 'deividyz@gmail.com',
                cpfCnpj: '38934783885',
                postalCode: '13466321',
                addressNumber: '501',
                mobilePhone: '19992804294',
            },

            details: {
                number: '5162306219378829',
                expiryMonth: formatDate(addDays(new Date(), 30), 'MM'),
                expiryYear: formatDate(new Date(), 'yyyy'),
                ccv: '318'
            }
        };

        const paymentResponse = await paymentClient.pay(
            customer.id,
            creditCardData,
            {
                installmentCount: 6,
                dueDate: formatDate(addDays(new Date(), 1), 'yyyy-MM-dd'),
                value: 100
            }
        );

        assert(paymentResponse);
        assert(paymentResponse.creditCard);
        assert(paymentResponse.creditCard.creditCardToken);
    });

    it('pay() with token', async () => {
        const customerClient = new CustomerClient(TEST_ASAAS_TOKEN, 'sandbox');
        const paymentClient = new PaymentClient(TEST_ASAAS_TOKEN, 'sandbox');

        const customer = await customerClient.create({
            name: 'Deividy Metheler Zachetti',
            cpfCnpj: 38934783885
        });

        const creditCardData = {
            holder: {
                name: 'Deividy M Zachetti',
                email: 'deividyz@gmail.com',
                cpfCnpj: '38934783885',
                postalCode: '13466321',
                addressNumber: '501',
                mobilePhone: '19992804294',
            },

            details: {
                number: '5162306219378829',
                expiryMonth: formatDate(addDays(new Date(), 30), 'MM'),
                expiryYear: formatDate(new Date(), 'yyyy'),
                ccv: '318'
            }
        };

        const paymentResponse = await paymentClient.pay(
            customer.id,
            creditCardData,
            {
                installmentCount: 1,
                dueDate: formatDate(addDays(new Date(), 1), 'yyyy-MM-dd'),
                value: 100
            }
        );

        const token = paymentResponse.creditCard.creditCardToken;
        const paymentResponse2 = await paymentClient.pay(
            customer.id,
            { token },
            {
                installmentCount: 1,
                dueDate: formatDate(addDays(new Date(), 1), 'yyyy-MM-dd'),
                value: 1000
            }
        );

        assert(paymentResponse2.status === 'CONFIRMED');
    });

    it.skip('transfer production', async () => {
        const customerClient = new CustomerClient(process.env.ASAAS_TOKEN, 'prod');
        const response = await customerClient.doRequest(
            'POST',
            'transfers',
            {
                value: 2,
                bankAccount: {
                    bank: { code: 260 },
                    accountName: 'NuBank Deividy',
                    ownerName: 'Deividy Metheler Zachetti',
                    ownerBirthDate: '1990-05-08',
                    cpfCnpj: '38934783885',
                    agency: '0001',
                    account: '7422014',
                    accountDigit: '5',
                    bankAccountType: 'CONTA_CORRENTE'
                }
            }
        );

        console.log(response);
    });
});
