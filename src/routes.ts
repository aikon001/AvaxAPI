export { }

import express = require('express');

import Service from "./service";
const router = express.Router();

let service = new Service();

router.get(
  '/orderedTxsForAddress/:address',
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    var { address } = req.params;
    await service.orderedTransactions(address)
      .then((result) => res.send(result))
      .catch((err) => next(err))
  }
)

router.get(
  '/TxsForAddress/:address',
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    var { address } = req.params;
    await service.allTransactions(address)
      .then((result) => res.send(result))
      .catch((err) => next(err))
  }
)

router.get(
  '/TxsByValue',
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await service.transactionsByValue()
      .then((result) => res.send(result))
      .catch((err) => next(err))
  }
)

router.get(
  '/first100ByBalance',
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    await service.first100ByBalance()
      .then((result) => res.send(result))
      .catch((err) => next(err))
  }
)

export default router;