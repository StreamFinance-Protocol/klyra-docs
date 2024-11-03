---
sidebar_position: 2
description: Place raw orders on the orderbook
---

# Place Order Methods

Place order methods are the way to interface with the Klyra's orderbook. Through these methods you can place different types of orders including limit, market, take profit, stop loss, etc.

## Market Order

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import {
  WalletSubaccountInfo,
  TxResponsePromise,
  OrderSide,
} from "@klyra/core";

const subaccount = new WalletSubaccountInfo(wallet, 0);
const ticker = "BTC-USD"; // perpetual market id
const side = Order_Side.SIDE_BUY; // side of the order
const size = 0.13; // the size of the order
const reduceOnly = false; // if true, the order will only reduce the position size

const tx: TxResponsePromise = await klyra.placeMarketOrder(
  subaccount,
  ticker,
  side,
  size,
  reduceOnly
);
```

  </TabItem>

</Tabs>

<br />
A market order will attempt to be matched on the orderbook starting at the best price. If the order cannot be fully matched due to insufficient liquidity, the remaining amount will be cancelled.

:::note
If you want the remaining amount to be placed on the orderbook as a maker order, use a limit order
:::
<br />

| Parameters         | Required | Type           | Description                                                                                                   |
| ------------------ | -------- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| `subaccount`       | True     | SubaccountInfo | The subaccount the order is on behalf of                                                                      |
| `ticker`           | True     | string         | The id of the market the order is intended for                                                                |
| `side`             | True     | OrderSize      | The side of the order (`BUY` or `SELL`)                                                                       |
| `size`             | True     | number         | The size of tokens in the quote asset                                                                         |
| `reduceOnly`       | True     | boolean        | Is the order a reduce-only order                                                                              |
| `clientId`         | False    | number         | Set to a number, can be used by the client to identify the order. Randomly generate if not set                |
| `routerFeePpm`     | False    | number         | The percentage in parts-per-million of the order that should be passed as a fee to the router if there is one |
| `routerSubaccount` | False    | SubaccountInfo | The subaccount of the party that routed the order to Klyra                                                    |

## Limit Order

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import {
  WalletSubaccountInfo,
  TxResponsePromise,
  OrderSide,
} from "@klyra/core";

const subaccount = new WalletSubaccountInfo(wallet, 0);
const ticker = "BTC-USD"; // perpetual market id
const side = Order_Side.SIDE_BUY; // side of the order
const price = 65136; // the price of the limit order
const size = 0.13; // the size of the order
const goodTilBlockTime = Math.floor(Date.now() / 1000) + 3600; // the unix timestamp the order expires at
const reduceOnly = false; // if true, the order will only reduce the position size

const tx: TxResponsePromise = await klyra.placeLimitOrder(
  subaccount,
  ticker,
  side,
  price,
  size,
  goodTilBlockTime,
  reduceOnly
);
```

  </TabItem>
</Tabs>

<br />
A limit order will attempt to be matched on the orderbook starting at the specified `price`. If there are no makers at the specified `price`, the order will be placed on the orderbook
as a maker order at that price.

<br />

| Parameters         | Required | Type           | Description                                                                                                   |
| ------------------ | -------- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| `subaccount`       | True     | SubaccountInfo | The subaccount the order is on behalf of                                                                      |
| `ticker`           | True     | string         | The id of the market the order is intended for                                                                |
| `side`             | True     | OrderSize      | The side of the order (`BUY` or `SELL`)                                                                       |
| `price`            | True     | number         | The price the order is executed at                                                                            |
| `size`             | True     | number         | The size of tokens in the quote asset                                                                         |
| `goodTilBlockTime` | True     | number         | The unix timestamp the order expires at                                                                       |
| `reduceOnly`       | True     | boolean        | Is the order a reduce-only order                                                                              |
| `clientId`         | False    | number         | Set to a number, can be used by the client to identify the order. Randomly generate if not set                |
| `routerFeePpm`     | False    | number         | The percentage in parts-per-million of the order that should be passed as a fee to the router if there is one |
| `routerSubaccount` | False    | SubaccountInfo | The subaccount of the party that routed the order to Klyra                                                    |

## Stop Loss Order (Market)

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { WalletSubaccountInfo, TxResponsePromise, OrderSide } from '@klyra/core';

const subaccount = new WalletSubaccountInfo(wallet, 0);
const ticker = "BTC-USD" // perpetual market id
const side = Order_Side.SIDE_BUY // side of the order
const triggerPrice = 65000 // the price the order will be triggered at
const size = 0.13; // the size of the order
const goodTilBlockTime = Math.floor(Date.now() / 1000) + 3600 // the unix timestamp the order expires at
const reduceOnly = false; // if true, the order will only reduce the position size

const tx: TxResponsePromise = await klyra.placeStopLossMarketOrder(
  subaccount,
  ticker,
  side,
  triggerPrice
  size,
  goodTilBlockTime,
  reduceOnly,
);
```

  </TabItem>
</Tabs>

<br />
A stop loss market order will place a stop loss order when the markets price hits the `triggerPrice`. When triggered the order will attempt to be matched as a market order.
<br />

:::note
Getting matched as a market order means if the order doesn't fully matched than the remaining amount won't be placed back on the orderbook. Use a stop loss limit order if you want the remaining amount to be placed on the orderbook as a maker order
:::

| Parameters         | Required | Type           | Description                                                                                                   |
| ------------------ | -------- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| `subaccount`       | True     | SubaccountInfo | The subaccount the order is on behalf of                                                                      |
| `ticker`           | True     | string         | The id of the market the order is intended for                                                                |
| `side`             | True     | OrderSize      | The side of the order (`BUY` or `SELL`)                                                                       |
| `triggerPrice`     | True     | number         | The price the conditional order will be triggered at                                                          |
| `size`             | True     | number         | The size of tokens in the quote asset                                                                         |
| `goodTilBlockTime` | True     | number         | The unix timestamp the order expires at                                                                       |
| `reduceOnly`       | True     | boolean        | Is the order a reduce-only order                                                                              |
| `clientId`         | False    | number         | Set to a number, can be used by the client to identify the order. Randomly generate if not set                |
| `routerFeePpm`     | False    | number         | The percentage in parts-per-million of the order that should be passed as a fee to the router if there is one |
| `routerSubaccount` | False    | SubaccountInfo | The subaccount of the party that routed the order to Klyra                                                    |

## Stop Loss Order (Limit)

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { WalletSubaccountInfo, TxResponsePromise, OrderSide } from '@klyra/core';

const subaccount = new WalletSubaccountInfo(wallet, 0);
const ticker = "BTC-USD" // perpetual market id
const side = Order_Side.SIDE_BUY // side of the order
const price = 65100 // the price of the limit order
const triggerPrice = 65000 // the price the order will be triggered at
const size = 0.13; // the size of the order
const goodTilBlockTime = Math.floor(Date.now() / 1000) + 3600 // the unix timestamp the order expires at
const reduceOnly = false; // if true, the order will only reduce the position size

const tx: TxResponsePromise = await klyra.placeStopLossLimitOrder(
  subaccount,
  ticker,
  side,
  price,
  triggerPrice
  size,
  goodTilBlockTime,
  reduceOnly,
);
```

  </TabItem>
</Tabs>

<br />
A stop loss limit order will place a stop loss order when the markets price hits the `triggerPrice`. Once triggered the stop loss will exist as a limit order on the orderbook.
<br />

| Parameters         | Required | Type           | Description                                                                                                   |
| ------------------ | -------- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| `subaccount`       | True     | SubaccountInfo | The subaccount the order is on behalf of                                                                      |
| `ticker`           | True     | string         | The id of the market the order is intended for                                                                |
| `side`             | True     | OrderSize      | The side of the order (`BUY` or `SELL`)                                                                       |
| `price`            | True     | number         | The price the order is executed at                                                                            |
| `triggerPrice`     | True     | number         | The price the conditional order will be triggered at                                                          |
| `size`             | True     | number         | The size of tokens in the quote asset                                                                         |
| `goodTilBlockTime` | True     | number         | The unix timestamp the order expires at                                                                       |
| `reduceOnly`       | True     | boolean        | Is the order a reduce-only order                                                                              |
| `clientId`         | False    | number         | Set to a number, can be used by the client to identify the order. Randomly generate if not set                |
| `routerFeePpm`     | False    | number         | The percentage in parts-per-million of the order that should be passed as a fee to the router if there is one |
| `routerSubaccount` | False    | SubaccountInfo | The subaccount of the party that routed the order to Klyra                                                    |

## Take Profit Order

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { WalletSubaccountInfo, TxResponsePromise, OrderSide } from '@klyra/core';

const subaccount = new WalletSubaccountInfo(wallet, 0);
const ticker = "BTC-USD" // perpetual market id
const side = Order_Side.SIDE_BUY // side of the order
const price = 65100 // the price of the limit order
const triggerPrice = 65000 // the price the order will be triggered at
const size = 0.13; // the size of the order
const goodTilBlockTime = Math.floor(Date.now() / 1000) + 3600 // the unix timestamp the order expires at
const reduceOnly = false; // if true, the order will only reduce the position size

const tx: TxResponsePromise = await klyra.placeTakeProfitLimitOrder(
  subaccount,
  ticker,
  side,
  price,
  triggerPrice
  size,
  goodTilBlockTime,
  reduceOnly,
);
```

  </TabItem>
</Tabs>

<br />
A take profit order will place a take profit limit order when the markets price hits the `triggerPrice`. Once triggered the order will act as a limit order on the orderbook.
<br />

:::note
To place a take profit market order, just place a limit order with `price` equal to the trigger price you intend the take profit to execute at
:::

| Parameters         | Required | Type           | Description                                                                                                   |
| ------------------ | -------- | -------------- | ------------------------------------------------------------------------------------------------------------- |
| `subaccount`       | True     | SubaccountInfo | The subaccount the order is on behalf of                                                                      |
| `ticker`           | True     | string         | The id of the market the order is intended for                                                                |
| `side`             | True     | OrderSize      | The side of the order (`BUY` or `SELL`)                                                                       |
| `price`            | True     | number         | The price the order is executed at                                                                            |
| `triggerPrice`     | True     | number         | The price the conditional order will be triggered at                                                          |
| `size`             | True     | number         | The size of tokens in the quote asset                                                                         |
| `goodTilBlockTime` | True     | number         | The unix timestamp the order expires at                                                                       |
| `reduceOnly`       | True     | boolean        | Is the order a reduce-only order                                                                              |
| `clientId`         | False    | number         | Set to a number, can be used by the client to identify the order. Randomly generate if not set                |
| `routerFeePpm`     | False    | number         | The percentage in parts-per-million of the order that should be passed as a fee to the router if there is one |
| `routerSubaccount` | False    | SubaccountInfo | The subaccount of the party that routed the order to Klyra                                                    |
