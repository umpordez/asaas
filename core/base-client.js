const axios = require('axios');
const V = require('argument-validator');

const configByEnv = {
    sandbox: { baseUrl: 'https://sandbox.asaas.com/api/v3' },
    prod: { baseUrl: 'https://api.asaas.com/v3' }
};

class AsaasBaseClient {
    constructor(token, env = 'sandbox') {
        V.string(token, 'token');

        this.env = env;
        this.accessToken = token;

        this.config = configByEnv[env];

        this.lastRequests = [];
        this.lastResponses = [];
    }

    async doRequest(method, url, body) {
        V.string(method, 'method');
        V.string(url, 'url');

        const headers = {
            'Content-Type': 'application/json',
            'access_token': this.accessToken
        };

        url = `${this.config.baseUrl}/${url}`;
        const options = {
            method: method.toUpperCase(),
            headers,
            url,
            data: body ? JSON.stringify(body) : undefined
        };

        this.lastRequest = { ...options, data: body };

        if (body) {
            if (body.creditCard) {
                body.creditCard = '[hidden]';
            }

            if (body.creditCardHolderInfo) {
                body.creditCardHolderInfo = '[hidden]';
            }

            this.lastRequest.body = body;
        }

        this.lastRequests.push(this.lastRequest);

        let response;

        const { stack } = new Error();

        try {
            const res = await axios(options);

            this.lastResponse = { body: res.data, headers: res.headers };
            this.lastResponses.push(this.lastResponse);

            response = res.data;
        } catch (ex) {
            ex.response = ex.response || ex.res;
            if (ex.response) {
                const { response } = ex;
                this.lastResponse = {
                    body: response.data,
                    headers: response.headers
                };

                this.lastResponses.push(this.lastResponse);

                if (response.data && response.data.errors) {
                    ex.message = response.data.errors.reduce((acc, curr) => {
                        return acc.concat(curr.description);
                    }, []).join(' ');
                }
            }

            ex.stack = stack;
            throw ex;
        }

        return response;
    }
}

module.exports = AsaasBaseClient;
