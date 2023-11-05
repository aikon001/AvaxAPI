import axios from "axios";
require('dotenv').config({ path: './.env' })

const url = `https://avalanche-mainnet.infura.io/v3/${process.env.PROJECT_ID}`;

async function getBlock(num: number): Promise<any[]> {
    const payload = {
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber",
        params: [`0x${num.toString(16)}`, true],
        id: 1
    };
    return axios.post(url, payload)
        .then((response: any) => {
            if (response.data.result) {
                return response.data.result.transactions;
            }
        });
}

export async function getAvaxTransactions(callback: any) {

    const payload = {
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber",
        params: ["latest", true],
        id: 1
    };

    const lastBlockNumber: number = await axios.post(url, payload)
        .then((response: any) => {
            return parseInt(response.data.result.number, 16);
        });
    for (var i = 0; i < 10000; i++) {
        const block = await getBlock(lastBlockNumber - i);
        callback(block)
    }

}

export async function getAvaxBalance(address: string) {

    const payload = {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 1
    };

    const response = await axios.post(url, payload);
    const balance = response.data.result;

    return balance;
}