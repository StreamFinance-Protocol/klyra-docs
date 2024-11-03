---
sidebar_position: 1
---

# Client Side

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

The `klyra` instance has a `getState()` method, which can be used to get data from the Cortex store. This will be really useful because it automatically handles the connection to the Indexer and the parsing and processing of the data.

:::note
The Cortex store needs to get data from the Indexer through WebSockets. If you disable the WebSocket connection, the `getState()` method will return an empty store.
:::

```typescript
import { klyra } from "@/lib/klyra";

const store = klyra.getState();
const { markets, orderbooks } = store;
```

While using the `getState()` method is the easiest way to get data from the Klyra network, it is not the only way. The Core instance also has methods to get data from the Indexer, such as `getOrderbook(id)` or `getAllMarkets()`, for example. These methods do not use WebSockets and will make a direct REST request to the Indexer.

```typescript
import { klyra } from "@/lib/klyra";

const orderbook = await klyra.getOrderbook("BTC-USD");
const markets = await klyra.getAllMarkets();
```

## Authenticating users

In order to authenticate an user, you can use Klyra's `authenticateUser()` method, which takes a signature and an optional subaccountNumber (defaults to 0) as parameters. This method will return a `Wallet` instance. This `Wallet` instance can then be used to sign transactions. The `Wallet` instance also contains the user's address, which can be used to identify the user.

When using the `authenticateUser()` method, Cortex will automatically subscribe to the user's subaccount and update the state accordingly, populating the `account` object with the user's information.

:::note
You can create your custom authentication logic, as long as you pass a signature to the `authenticateUser` method. One could, for example, have a database of user emails to private keys and, when a user logs in with their email, the server signs a message using the private key and passes the signature to the `authenticateUser` method.
:::

```typescript
// file: src/lib/klyra.ts
import { klyra } from "@/lib/klyra";

const signature = "0x..."; // the signature of the user
const { wallet, address } = await klyra.authenticateUser(signature);
```

## Posting data to the network

When interacting with the Klyra network, you will often need to post data to the network, to place or cancel an order, for example. This can also be done using the `klyra` instance.

There are many methods to interact with the network, such as `placeCustomOrder()`, `cancelOrder()`, `placeMarketOrder()`, etc.

If you have already authenticated the user, Cortex will automatically get the user's subaccount information from the `account` object, so you don't need to create a `WalletSubaccountInfo` instance.

```typescript
import { klyra } from "@/lib/klyra";
import { WalletSubaccountInfo, TxResponsePromise, OrderSide } from '@klyra/core';

// not needed if the user is already authenticated
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

## Using Cortex with React

There are two main things we need to do when using Cortex with React:

1. Set the current market ticker
2. Expose the Klyra instance through React context, so it can be accessed in any component
3. Have a hook that will subscribe to the store and return the latest state

### Set current market ticker

When fetching data from the Indexer, methods related to orderbooks and markets (such as getting a market's orderbook or trades) require a market ticker as a parameter. We can set a default market ticker by setting the `defaultMarketTicker` property of the `cortex` object of the `klyra` instance upon initialization.

```typescript
const klyra = new Klyra({
  /// other configurations...
  cortex: {
    defaultMarketTicker: "BTC-USD",
  },
});
```

By doing this, the `defaultMarketTicker` will be used as the market ticker when fetching data from the Indexer (both through WebSockets and REST), unless otherwise specified. You can change the selected market ticker at any time by calling the `setMarketTicker()` method on the `klyra` instance. For example, every time the user changes the market ticker in your application, you can update the market ticker like this:

```typescript
export default function Page({ ticker }: { ticker: string }) {
  const klyra = useKlyra();
  klyra.setMarketTicker(ticker);

  return <div>{ticker}</div>;
}
```

### Expose the Klyra instance through React context

Doing this is very simple, as we are exporting the Klyra instance from the `@/lib/klyra.ts` file.

```typescript
// file: src/context/klyra.tsx
import { Klyra } from "@klyra/core";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

import klyra from "./init";

const KlyraContext = createContext<Klyra | null>(null);

// You could also add error handling and loading states in the context provider
export const KlyraProvider = ({ children }: { children: ReactNode }) => {
  const [instance, setInstance] = useState<Klyra | null>(null);

  useEffect(() => setInstance(klyra), []);

  if (!instance) {
    return null;
  }

  return (
    <KlyraContext.Provider value={instance}>{children}</KlyraContext.Provider>
  );
};

export const useKlyra = (): Klyra => {
  const instance = useContext(KlyraContext);
  if (!instance) {
    throw new Error("useKlyra must be used within a KlyraProvider");
  }
  return instance;
};
```

And, just like in any other React application, we need to wrap our application in the `KlyraProvider` component. In your layout file or entry point file:

```typescript
import { KlyraProvider } from "@/context/klyra";

export default function Layout({ children }: { children: ReactNode }) {
  return <KlyraProvider>{children}</KlyraProvider>;
}
```

### Subscribe to the store and get the latest state

Since Cortex is an external store (that is not stored directly in the React application), we need to make sure that we are getting updates from the store. This is because, while Klyra's `getState()` method will return the latest data, it does not automatically update the state when the data changes.

One solution could be to use the `useEffect` hook to get the data from the store and update the state, but this is not elegant and causes many unnecessary re-renders.

A better solution is to use React's [`useSyncExternalStore`](https://react.dev/reference/react/useSyncExternalStore) hook, which will allow us to subscribe to the store and update the state when the data changes. The Klyra instance provides a `subscribeToState()` method, which will be used to subscribe to the store.

```typescript
// file: src/hooks/useKlyraStore.ts
import { StoreState } from "@klyra/core";
import { useCallback, useMemo, useSyncExternalStore } from "react";

import { useKlyra } from "@/context/klyra";

export function useKlyraStore(): StoreState {
  const instance = useKlyra();

  // Use useCallback to memoize the subscribe function
  const subscribe = useCallback(
    (callback: () => void) => instance.subscribeToState(callback),
    [instance]
  );

  // Use useMemo to memoize the getSnapshot function
  const getSnapshot = useMemo(() => () => instance.getStore(), [instance]);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
```

With this hook, you will always get the latest state from the store, like this:

```typescript
// file: src/app/page.tsx
import { useKlyraStore } from "@/hooks/useKlyraStore";

export default function MarketList() {
  const { markets } = useKlyraStore();

  // Convert the markets object to an array
  const marketsArray = Object.values(markets);

  return (
    <div>
      <ul>
        {marketsArray.map((market) => (
          <li key={market.id}>{market.id}</li>
        ))}
      </ul>
    </div>
  );
}
```

In order to post data to the network, you can use the `useKlyra()` hook, which will provide you with the Klyra instance and allow you to use all the methods available.

```typescript
export default function PlaceMarketOrder({ ticker }: { ticker: string }) {
  const klyra = useKlyra();

  const handlePlaceMarketOrder = () => {
    // since we are authenticated and using Cortex Forms, we can use the placeMarketOrder method
    // without having to pass the subaccount information or other parameters
    const tx = await klyra.placeMarketOrder();
    console.log(tx);
  };

  return (
    <button onClick={handlePlaceMarketOrder}>
      {/* all the fields needed for the placeMarketOrder method */}
      Place Market Order on {ticker}
    </button>
  );
}
```

In the future, we will provide a `@klyra/react` package, which will include hooks to interact with the Klyra network alongside other utilities and components.
