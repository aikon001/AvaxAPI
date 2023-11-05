import { getTransactions } from "./indexer";
import { getAvaxBalance } from "./json_rpc";

class HttpException extends Error {
    status: number;
    message: string;
    constructor(status: number, message: string) {
      super(message);
      this.status = status;
      this.message = message;
    }
  }

export default class service {

    orderedTransactions = async (address : string) => {
        let txs = await getTransactions();
        
        try {
            let match = txs.filter(tx => tx.from === address.toLowerCase() || tx.to === address.toLocaleLowerCase());
            if (match.length > 0) {
                return match.sort(tx => tx.blockNumber && tx.transactionIndex);
            } else {
                throw new HttpException(404, 'No tx found for given address');
            }
        } catch (e) {
            throw new HttpException(500, (e as Error).message);
        }
    }

    allTransactions = async (address : string) => {
        let txs = await getTransactions();
        
        try {
            let match = txs.filter(tx => tx.from === address.toLowerCase() || tx.to === address.toLocaleLowerCase());
            if (match.length > 0) {
                return match;
            } else {
                throw new HttpException(404, 'No tx found for given address');
            }
        } catch (e) {
            throw new HttpException(500, (e as Error).message);
        }
    }

    transactionsByValue = async () => {
        let txs = await getTransactions();
        
        try {
            return txs.sort(tx => tx.value).reverse();
        } catch (e) {
            throw new HttpException(500, (e as Error).message);
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
        Promise.all(accounts.map(async(address) => {
            let obj = {
                address : address,
                balance : await getAvaxBalance(address)
            };
            result.push(obj);
        }));

        try {
            return result.sort(x => x.balance).slice(-100).reverse();
        } catch (e) {
            throw new HttpException(500, (e as Error).message);
        }
    }
    
}