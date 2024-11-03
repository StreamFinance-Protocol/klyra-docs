---
sidebar_position: 2
---

# Server Side

If you are looking to interact with the Klyra network from a client side application, the installation of the client is the first step. We will use the `@klyra/core` package for this example, which will be the entry point for interacting with the Klyra network.

## Installation

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="npm" label="npm" default>

```bash
npm install @klyra/core
```

  </TabItem>
  <TabItem value="yarn" label="yarn">

```bash
yarn add @klyra/core
```

  </TabItem>
  <TabItem value="pnpm" label="pnpm">

```bash
pnpm add @klyra/core
```

  </TabItem>
</Tabs>

## Initialize Client

After installation, we can initialize the client. This will set up the client with the necessary configurations and connections to the Klyra network.

```typescript
// file: src/lib/klyra.ts
import { Klyra } from "@klyra/core";

const klyra = new Klyra({
  environment: "testnet",
  fees: {
    feePpm: 1000
    address: "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs"
    subaccountNumber: 0
  }
});

klyra.initialize();

export { klyra };
```

As you can see, we have exported the `klyra` instance, which will be used to interact with the Klyra network.
We can now import this instance into other files and use it to interact with the Klyra network.

## Fetching data

The Core instance has methods to get data from the Indexer, such as `getOrderbook(id)` or `getAllMarkets()`, for example. These methods do not use WebSockets and will make a direct REST request to the Indexer.

```typescript
// file: src/controllers/orderbooks.ts
import { Request, Response } from "express";
import { klyra } from "@/lib/klyra";

const getOrderbook = async (req: Request, res: Response) => {
  const { id } = req.params;
  const orderbook = await klyra.getOrderbook(id);

  if (!orderbook) {
    return res.status(404).json({ error: "Orderbook with id not found" });
  }

  res.json(orderbook);
};

const getMarkets = async (req: Request, res: Response) => {
  const { limit } = req.query;

  const markets = await klyra.getAllMarkets();
  const limitedMarkets = limit ? markets.slice(0, limit) : markets;

  res.json(limitedMarkets);
};
```

## Posting data to the network

When interacting with the Klyra network, you will often need to post data to the network, to place or cancel an order, for example. This can also be done using the `klyra` instance.

There are many methods to interact with the network, such as `placeCustomOrder()`, `cancelOrder()`, `placeMarketOrder()`, etc.

Before placing an order, we need to authenticate the user.

### Authenticating users

In order to authenticate an user, you can use Klyra's `authenticateUser()` method, which takes a signature and an optional subaccountNumber (defaults to 0) as parameters. This method will return a `Wallet` instance. This `Wallet` instance can then be used to sign transactions. The `Wallet` instance also contains the user's address, which can be used to identify the user.

:::note
You can create your custom authentication logic, as long as you pass a signature to the `authenticateUser` method. One could, for example, have a database of user emails to private keys and, when a user logs in with their email, the server signs a message using the private key and passes the signature to the `authenticateUser` method.
:::

```typescript
// file: src/lib/klyra.ts
import { klyra } from "@/lib/klyra";

export const authenticateUser = async (
  signature: string,
  subaccountNumber?: number
): Promise<{
  wallet: LocalWallet;
  address: string;
  subaccountInfo: WalletSubaccountInfo;
}> => {
  const { wallet, address } = await klyra.authenticateUser(signature);

  const subaccountInfo = new WalletSubaccountInfo(wallet, subaccountNumber);

  return { wallet, address, subaccountInfo };
};
```

Now that we have our `authenticateUser` method, we can use it in our routes to authenticate users and sign transactions.

```typescript
// file: src/controllers/orders.ts
import { Request, Response } from "express";
import { authenticateUser } from "@/lib/klyra";

const placeMarketOrder = async (req: Request, res: Response) => {
  const { signature, ticker, side, size, reduceOnly, clientId } = req.body;

  // one should validate the signature and all the other fields before proceeding

  const { wallet, address, subaccountInfo } = await authenticateUser(signature);

  const txResponse = await klyra.placeMarketOrder(
    subaccountInfo,
    ticker,
    side,
    size,
    reduceOnly,
    clientId
  );
};
```
