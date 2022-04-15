const axios = require('axios');
const V = require('argument-validator');

const configByEnv = {
    sandbox: { baseUrl: 'https://www.asaas.com' },
    prod: { baseUrl: 'https://sandbox.asaas.com' }
};

class AsaasPayment {
    constructor(token, env = 'sandbox') {
        V.string(token, 'token');

        this.env = env;
        this.accessToken = token;

        this.config = configByEnv[env];
    }

    async doRequest(method, url, body) {
        V.string(method, 'method');
        V.string(url, 'url');

        const headers = {
            'Content-Type': 'application/json',
            'access_token': this.accessToken
        };

        this.lastRequest = { headers, url, body };

        try {
            const res = await axios({
                method: method.toUpperCase(),
                url: `${this.config.baseUrl}/${url}`
            });

            this.lastResponse = res;
        } catch (ex) {

        }
    }
}

module.exports = AsaasPayment;
