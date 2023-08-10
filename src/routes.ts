export {}

import express = require('express');

const Service = require("./service");
const router = express.Router();

class HttpException extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }
}

const callback = (status : number, message : string) => {
  let e : HttpException = new HttpException(status,message);
  throw e;
}

let service = new Service(callback);

router.get(
  '/orderedTxsForAddress/:address',
  async (req : express.Request, res : express.Response) => {
    var { address } = req.params;
    var result = await service.orderedTransactions(address);
    res.send(result);
  }
)

router.get(
  '/TxsForAddress/:address',
  async (req : express.Request, res : express.Response) => {
    var { address } = req.params;
    var result = await service.allTransactions(address);
    res.send(result);
  }
)

router.get(
  '/TxsByValue',
  async (req : express.Request, res : express.Response) => {
    var result = await service.transactionsByValue();
    res.send(result);
  }
)

router.get(
  '/first100ByBalance',
  async (req : express.Request, res : express.Response) => {
    var result = await service.first100ByBalance();
    res.send(result);
  }
)

module.exports = router;