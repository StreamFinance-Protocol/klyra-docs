---
sidebar_position: 2
description: See example server usage of the KlyraSDK
---

# Server Example
Learn how to implement the KlyraSDK on a backend server. For this example we will use a preexisting [Express](https://expressjs.com/) server template and work from there. The example will go through the following steps:
- **Installation**: Installing the KlyraSDK
- **Initialization**: Configuring and initializing the KlyraSDK and the Express server
- **Creating Endpoints**: Creating controllers and routes for specific endpoints

:::note
The code for all of the following can be found [here](https://github.com/GonzaDDV/klyra-sdk)
:::

## Installation
First we need to install the KlyraSDK

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
  pnpm install @klyra/core
  ```

  </TabItem>
</Tabs>

## Initialization
Now in the entry point of our project we need to create an instance of the KlyraSDK and initialize it to connect it to Klyra

```typescript title="src/index.ts"
import cors from "cors";
import { config as dotenvConfig } from "dotenv";
import express from "express";
// import Klyra
import { Klyra } from "@klyra/core";
import { router } from "./routes";

dotenvConfig();

const app = express();
const port = process.env.PORT ?? 3000;

// create an instance of the KlyraSDK
export const klyra = new Klyra({
  environment: "testnet", // the network you are connecting to
  fees: {
    feePpm: 1000, // 0.1% fee transferred to the specified address below
    address: "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs", // the address fees are transferred to
    subaccountNumber: 0, // the subaccount of the address fees are transferred to
  },
});

app.use(cors({ origin: "*" }));

app.get("/status", (_, response) => {
  response.json({ status: "ok" });
});

app.use(router);

// initialize the klyraSDK - will connect the SDK to Klyra
await klyra.initialize();

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
```

We first create an instance of the KlyraSDK. In this instance we pass in the necessary config we wish to have:
- **environment**: "testnet" or "mainnet"
- **fees**: This determines a default fee to take on all orders submitted by our server. Fees can be controlled on a per-order basis, but if there is not fees specified for a specific order it will use the default. Fees can also be set to zero

Now our express server is running, and we have created an instance of the KlyraSDK and initialized it so it connects to Klyra

## Creating Endpoints
Finally we need to create endpoints for our server so we can query data and submit orders to Klyra.

### Query Endpoints
Query endpoints will be hit with GET requests and use the KlyraSDK to easily fetch the data, then process the data, and finally return it to the client. We will show example of both querying market data and account data

#### Creating the Controller
First we need to create the controller for the endpoint, usually endpoint controllers are in `src/controllers/`. We will start with importing the klyraSDK we created in `src/index.ts` in a new file `src/controllers/markets.controller.ts`

```typescript title="src/controllers/markets.controller.ts"
import { klyra } from "../index";
```

We can now easily create controllers for example getting the orderbook of a market, and getting the trades in that market
```typescript title="src/controllers/markets.controller.ts"
const getMarketOrderbook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { marketTicker } = req.params;
  if (!marketTicker) {
    throw new Error("Market Ticker is required");
  }
  const orderbook = await klyra.getOrderbook(marketTicker);

  // process data as you wish before responding to the client

  res.json(orderbook);
};

const getMarketTrades = async (req: Request, res: Response): Promise<void> => {
  const { marketTicker } = req.params;
  if (!marketTicker) {
    throw new Error("Market Ticker is required");
  }
  const trades = await klyra.getMarketTrades(marketTicker);

  // process data as you wish before responding to the client

  res.json(trades);
};
```

The full code in the controller should now look like this

```typescript title="src/controllers/markets.controller.ts"
import { type Request, type Response } from "express";
import { klyra } from "../index";

// Endpoint Controllers
const getMarketOrderbook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { marketTicker } = req.params;
  if (!marketTicker) {
    throw new Error("Market Ticker is required");
  }
  const orderbook = await klyra.getOrderbook(marketTicker);

  res.json(orderbook);
};

const getMarketTrades = async (req: Request, res: Response): Promise<void> => {
  const { marketTicker } = req.params;
  if (!marketTicker) {
    throw new Error("Market Ticker is required");
  }
  const trades = await klyra.getMarketTrades(marketTicker);
  res.json(trades);
};

export const marketsController = {
  getMarketOrderbook,
  getMarketTrades,
};
```
Ok so now we have our controllers, and we can move on to create a route for our express server

#### Creating the Route
Usually routes in express servers are kept at `src/routes/`, and here we can create our first route to handle our market query endpoints in a new file `src/routes/markets.router.ts`. 

```typescript title="src/routes/markets.router.ts"
import { Router } from "express";
import { marketsController } from "../controllers/markets.controller";

const router = Router();

router.get("/orderbook/:marketTicker", marketsController.getMarketOrderbook);
router.get("/trades/:marketTicker", marketsController.getMarketTrades);

export { router as marketsRouter };
```

Now in the router's entry point (i.e the location you export the router to `src/index.ts`), we can import our new `markets.router.ts` file and specify to our application to use these routes for all calls to the `/markets` endpoint

```typescript title="src/routes/index.ts"
import { Router } from "express";
import { marketsRouter } from "./markets.router";

const router = Router();

router.use("/markets", marketsRouter);

export { router };
```
Great! We have just created our first endpoint which will service GET requests intended to fetch market data from Klyra like orderbook data and market trades

### Order Endpoints
Order endpoints will be hit with POST requests and is designed to handle a client's intention to place an order on Klyra

#### Authentication Flow
In order to submit orders to klyra, we need to sign our transactions. In this example we will use a custodial solution in which users create an account with a username + password and our server will derive their klyra private key from this and use it to sign transactions. First we need to create an authentication function which will delegate to the KlyraSDK to build a `WalletSubaccountInfo` object from the credentials. This code can be used in the controller we create in the next step.

```typescript
import { type LocalWallet, WalletSubaccountInfo } from "@klyra/core";
import { klyra } from "../index";
const authenticateUser = async (
  username: string,
  pwd: string,
  subaccountNumber?: number
): Promise<{
  wallet: LocalWallet;
  address: string;
  subaccountInfo: WalletSubaccountInfo;
}> => {
  // here ensure the username exists in your DB

  // we use @klyra/core's `authenticateUser` so we don't have to worry about how to get the wallet from user's credentials
  const { wallet, address } = await klyra.authenticateUserFromCredentials(
    username,
    pwd
  );

  // the WalletSubaccountInfo class is used to sign messages on behalf of a subaccount, which is why we need to pass the wallet and the subaccount number. It's used to place orders, cancel orders, etc.
  const subaccountInfo = new WalletSubaccountInfo(wallet, subaccountNumber);

  return { wallet, address, subaccountInfo };
};
```


#### Creating the Controller
Similarly to the query endpoint we need to create a file for our controller and import our KlyraSDK instance. We will call our file `orders.controller.ts`

```typescript title="src/controllers/orders.controller.ts"
import { klyra } from "../index";
```


We can now easily create controllers for example a controller to handle placing market orders. In this we will use our authentication function we created above. Our controller should now look like this

```typescript title="src/controllers/orders.controller.ts"
import { type Request, type Response } from "express";
import { LocalWallet, WalletSubaccountInfo, type OrderSide } from "@klyra/core";
import dotenv from "dotenv";
import { klyra } from "../lib/klyra";

dotenv.config();
// Create a type to handle the request body
interface PlaceMarketOrderRequestBody {
  username: string;
  pwd: string;
  subaccountNumber: number;
  marketTicker: string;
  side: OrderSide;
  size: number;
  reduceOnly?: boolean;
  clientId?: number;
  memo?: string;
}

// OPTIONAL - config for custom router fees on a per-order basis. Not needed because the default was set in `src/index.ts`
const MNEMONIC = process.env.MNEMONIC ?? "default_mnemonic";
const ROUTER_FEE_PPM = 1000;

// Authentication helper function to fetch a wallet from an username, password combination
const authenticateUser = async (
  username: string,
  pwd: string,
  subaccountNumber?: number
): Promise<{
  wallet: LocalWallet;
  address: string;
  subaccountInfo: WalletSubaccountInfo;
}> => {
  // here ensure the username exists in your DB

  // we use @klyra/core's `authenticateUser` so we don't have to worry about how to get the wallet from user's credentials
  const { wallet, address } = await klyra.authenticateUserFromCredentials(
    username,
    pwd
  );

  // The WalletSubaccountInfo class is used to sign messages on behalf of a subaccount, which is why we need to pass the wallet and the subaccount number. It's used to place orders, cancel orders, etc.
  const subaccountInfo = new WalletSubaccountInfo(wallet, subaccountNumber);

  return { wallet, address, subaccountInfo };
};

// Create the controller
const placeMarketOrder = async (
  req: Request<unknown, unknown, PlaceMarketOrderRequestBody>,
  res: Response
): Promise<void> => {
  // Get the necessary data from the request body
  const {
    marketTicker,
    side,
    size,
    reduceOnly = false,
    clientId,
    memo,
    username,
    pwd,
    subaccountNumber,
  } = req.body;

  try {
    // authenticate the user,
    const { subaccountInfo } = await authenticateUser(
      username,
      pwd,
      subaccountNumber
    );

    const routerWallet = await LocalWallet.fromMnemonic(MNEMONIC, "klyra");
    const routerSubaccount = new WalletSubaccountInfo(routerWallet, 0);

    const txResponse = await klyra.placeMarketOrder(
      subaccountInfo,
      marketTicker,
      side,
      size,
      reduceOnly,
      clientId,
      ROUTER_FEE_PPM,
      routerSubaccount,
      memo
    );

    res.json({ hash: txResponse.hash });
  } catch (error) {
    console.error("Error placing market order:", error);
    res.status(500).json({ error: "Failed to place market order" });
  }
};

export const ordersController = {
  placeMarketOrder,
};
```
The highlevel flow is the following:
- Verify that the credentials passed in, point to a valid user in our DB
- Derive a Klyra wallet from these credentials
- Place the order using the KlyraSDK and return the transaction hash

The flow is the same for all types of orders (e.g, `cancelMarketOrder`, `placeLimitOrder`, `placeTakeProfitMarketOrder`, etc.)

:::note
You can find all order types [here](../api-methods/transactions/placing-orders.md)
:::
#### Creating the Route
Like the markets route, we can create a new route to handle order placements in a new file `src/routes/orders.router.ts`. 

```typescript title="src/routes/orders.router.ts"
import { Router } from "express";
import { ordersController } from "../controllers/orders.controller";

const router = Router();

router.post("/place-market-order", ordersController.placeMarketOrder);

export { router as ordersRouter };

```

Now in the router's entry point (i.e the location you export the router to `src/index.ts`), we can import our new `orders.router.ts` file and specify to our application to use these routes for all calls to the `/orders` endpoint

```typescript title="src/routes/index.ts"
import { Router } from "express";
import { marketsRouter } from "./markets.router";
import { ordersRouter } from "./orders.router";


const router = Router();

router.use("/markets", marketsRouter);
router.use("/orders", ordersRouter);
```
Great! We now have both `markets` and `orders` endpoints.

---

We now have a full express server using the KlyraSDK to connect to klyra. See the full example code [here](https://github.com/GonzaDDV/klyra-sdk) where we expand on this example and add other endpoints






