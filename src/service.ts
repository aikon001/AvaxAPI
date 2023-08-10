import { getTransactions } from "./indexer";
import { getAvaxBalance } from "./json_rpc";

class service {
    callback: Function;

    constructor(callback: Function){
        this.callback = callback;
    }

    orderedTransactions = async (address : string) => {
        let txs = await getTransactions();
        
        try {
            let match = txs.filter(tx => tx.from === address.toLowerCase() || tx.to === address.toLocaleLowerCase());
            if (match.length > 0) {
                return match.sort(tx => tx.blockNumber && tx.transactionIndex);
            } else {
                this.callback(404, 'No tx found for given address');
            }
        } catch (e) {
            this.callback(500, (e as Error).message);
        }
    }

    allTransactions = async (address : string) => {
        let txs = await getTransactions();
        
        try {
            let match = txs.filter(tx => tx.from === address.toLowerCase() || tx.to === address.toLocaleLowerCase());
            if (match.length > 0) {
                return match;
            } else {
                this.callback(404, 'No tx found for given address');
            }
        } catch (e) {
            this.callback(500, (e as Error).message);
        }
    }

    transactionsByValue = async () => {
        let txs = await getTransactions();
        
        try {
            return txs.sort(tx => tx.value).reverse();
        } catch (e) {
            this.callback(500, (e as Error).message);
        }
    }

    first100ByBalance = async () => {
        const txs = await getTransactions();

        var accounts : string[] = [];
        txs.forEach(tx => {
            if (!accounts.includes(tx.from)){
                accounts.push(tx.from);
            }
            if (!accounts.includes(tx.to)){
                accounts.push(tx.to);
            }
        });
        var result : { address: string, balance: number }[] = [];
        await Promise.all(accounts.map(async(address) => {
            let obj = {
                address : address,
                balance : await getAvaxBalance(address)
            };
            result.push(obj);
        }));

        try {
            return result.sort(x => x.balance).slice(-100).reverse();
        } catch (e) {
            this.callback(500, (e as Error).message);
        }
    }
    
}

module.exports = service;