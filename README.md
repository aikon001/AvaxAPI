## avax-index-boilerplate

This repository contains a boilerplate Avax indexer that can be used to index and elaborate the transactions from Avalanche C-Chain. <br/>

## usage

Start redis
```
docker run --name redis -p 6379:6379 redis
```
Run the indexer with node as follows :
```
ts-node ./src/indexer.ts
```
It also implements a web service , run it with :
```
ts-node ./src/server.ts
```
