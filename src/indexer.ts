import { getAvaxTransactions } from "./json_rpc";

import * as redis from 'redis';

const url = 'redis://localhost:6379';
const client = redis.createClient({
    url
});

(async () => {
    await client.connect();
})();
  
client.on("ready", () => {
    console.log("Connected!");
});

async function saveTransactions(transactions : any[]) {
    const txs = await getTransactions();
    transactions.forEach(tx => {
        const check = txs.find((x: any) => x.blockHash == tx.blockHash);
        if (check){
            client.lRem('transactions',1,JSON.stringify(tx));
        } else {
            client.lPush('transactions',JSON.stringify(tx));
        }
    });
}

export async function getTransactions(){
    const transactions = await client.lRange('transactions', 0, -1);
    return transactions.map(tx => JSON.parse(tx));
}

function process() {
    setTimeout(async() => {
        var txs = await getAvaxTransactions();
        saveTransactions(txs);

        process();
    }, 1000);
}

process();