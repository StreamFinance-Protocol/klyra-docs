---
sidebar_position: 1
---

# Transactions

Transaction methods are those that will induce state changes on Klyra. These transactions are
submitted to klyra nodes through GRPC

## Placing Orders

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

  ```typescript
  import { OrderFlags, Order_Side, Order_TimeInForce, SubaccountClient } from '@klyra/core';
  
  const subaccount = new SubaccountClient(wallet, 0);
  const clientId = 123 // set to a number, can be used by the client to identify the order
  const clobPairId = 0 // perpetual market id
  const side = Order_Side.SIDE_BUY // side of the order
  const quantums = Long.fromNumber(1_000_000_000); // quantums are calculated by the size of the order
  const subticks = Long.fromNumber(1_000_000_000); // subticks are calculated by the price of the order
  const timeInForce = Order_TimeInForce.TIME_IN_FORCE_UNSPECIFIED; // TimeInForce indicates how long an order will remain active before it is executed or expires
  const orderFlags = OrderFlags.SHORT_TERM; // either SHORT_TERM, LONG_TERM or CONDITIONAL
  const reduceOnly = false; // if true, the order will only reduce the position size
  
  const tx = await klyra.placeOrder(
    subaccount,
    clientId,
    clobPairId,
    side,
    quantums,
    subticks,
    timeInForce,
    orderFlags,
    reduceOnly
  );
  ```

  </TabItem>
  <TabItem value="curl" label="cURL">

  ```bash
  curl -X POST https://klyra-node-1.com/placeOrder \
    -H "Content-Type: application/json" \
    -d '{
      "subaccount": "0",
      "clientId": 123,
      "clobPairId": 0,
      "side": "SIDE_BUY",
      "quantums": 1000000000,
      "subticks": 1000000000,
      "timeInForce": "TIME_IN_FORCE_UNSPECIFIED",
      "orderFlags": "SHORT_TERM",
      "reduceOnly": false
    }'
  ```

  </TabItem>
</Tabs>

<Tabs>
  <TabItem value="Base" label="Base" default>

| Param                  | Requirement | Type             | Description                                                                                                                   |
| ---------------------- | ----------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `subaccount`           | Required    | SubaccountInfo   | The subaccount the order is on behalf of                                                                                      |
| `marketId`             | Required    | string           | The id of the market the order is intended for                                                                                |
| `type`                 | Required    | OrderType        | The type of the order ([order type options](../types/orders.md))                                                              |
| `side`                 | Required    | OrderSize        | The side of the order (`BUY` or `SELL`)                                                                                       |
| `price`                | Required    | number           | The price the order should be executed at                                                                                     |
| `size`                 | Required    | number           | The size of tokens in the quote asset                                                                                         |
| `clientId`             | Required    | number           | Set to a number, can be used by the client to identify the order                                                              |
| `timeInForce`          | Optional    | OrderTimeInForce | Indicates how long an order will remain active before it is executed or expires ([time in force options](../types/orders.md)) |
| `goodTilTimeInSeconds` | Optional    | number           | Number of seconds before the order is expired                                                                                 |
| `execution`            | Optional    | OrderExecution   | The type of order execution ([order execution options](../types/orders.md))                                                   |
| `postOnly`             | Optional    | boolean          | Is the order a post-only order                                                                                                |
| `reduceOnly`           | Optional    | boolean          | Is the order a reduce-only order                                                                                              |
| `triggerPrice`         | Optional    | number           | The price an order is placed on the orderbook if it is conditional                                                            |
| `goodTilBlock`         | Optional    | number           | The block that the order is valid until ([read more here](../types/orders.md))                                                |

 </TabItem>
  <TabItem value="MarketBuy" label="Market Order">

| Param                  | Type             | Description                                                                                                                   |
| ---------------------- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `subaccount`           | SubaccountInfo   | The subaccount the order is on behalf of                                                                                      |
| `marketId`             | string           | The id of the market the order is intended for                                                                                |
| `type`                 | OrderType        | The type of the order ([order type options](../types/orders.md))                                                              |
| `side`                 | OrderSize        | The side of the order (`BUY` or `SELL`)                                                                                       |
| `price`                | number           | The price the order should be executed at                                                                                     |
| `size`                 | number           | The size of tokens in the quote asset                                                                                         |
| `clientId`             | number           | Set to a number, can be used by the client to identify the order                                                              |
| `timeInForce`          | OrderTimeInForce | Indicates how long an order will remain active before it is executed or expires ([time in force options](../types/orders.md)) |
| `execution`            | OrderExecution   | The type of order execution ([order execution options](../types/orders.md))                                                   |
| `goodTilBlock`         | number           | The block that the order is valid until ([read more here](../types/orders.md))                                                |

  </TabItem>
</Tabs>

## Canceling Orders
## Simulating Orders
## Transfers
## Simulating Transactions
## Signing Transactions
## Sending Transactions