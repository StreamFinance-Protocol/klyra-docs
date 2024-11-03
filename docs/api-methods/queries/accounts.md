---
sidebar_position: 3
description: Fetch account data from Klyra
---

# Accounts

Query all the data related to account specific information

## Positions

Fetch the positions of a given user

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { IndexerSubaccountAssetPosition } from "@klyra/core";

const address = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs";
const subaccountNumber = 0;

const marketInfo: IndexerSubaccountAssetPosition[] =
  await klyra.getSubaccountAssetPositions(address, subaccountNumber);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

address = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs"
subaccount_number = 0

params = {
    "address": address,
    "subaccountNumber": subaccount_number
}

response = requests.get("https://klyra-indexer.com/v4/assetPositions", params=params)
positions = response.json()
```

  </TabItem>

  <TabItem value="curl" label="cURL">

```bash
  curl -X GET "https://klyra-indexer.com/v4/assetPositions" \
   "?address={address}" \
   "&subaccountNumber={subaccountNumber}"
```

  </TabItem>
</Tabs>

#### Parameters

| Parameter          | Type   | Required | Description                                                   |
| ------------------ | ------ | -------- | ------------------------------------------------------------- |
| `address`          | string | true     | The address of the account                                    |
| `subaccountNumber` | number | true     | The identifier of the specific subaccount for a given address |

#### Returns

Returns an array of the following type

```typescript
interface IndexerSubaccountAssetPosition {
  address?: string;
  positionId?: string;
  subaccountNumber: number;
  assetId: string;
  symbol: string;
  side: IndexerPositionSide;
  size: string;
}
```

## Orders

Fetch the orders of a given user
<Tabs>
<TabItem value="typescript" label="TypeScript" default>

```typescript
import { IndexerSubaccountOrder } from "@klyra/core";

const address = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs";
const subaccountNumber = 0;

const marketInfo: IndexerSubaccountOrder[] = await klyra.getUserOrders(
  address,
  subaccountNumber
);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

address = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs"
subaccount_number = 0

params = {
    "address": address,
    "subaccountNumber": subaccount_number,
    "ticker": "BTC-USD",  # optional
    "side": "BUY"  # optional
}

response = requests.get("https://klyra-indexer.com/v4/orders", params=params)
orders = response.json()
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
  curl -X GET "https://klyra-indexer.com/v4/orders" \
   "?address={address}" \
   "&subaccountNumber={subaccountNumber}" \
   "&ticker={ticker}" \
   "&side={side}"
```

  </TabItem>
</Tabs>

#### Parameters

| Parameter          | Type                                          | Required | Description                                                   |
| ------------------ | --------------------------------------------- | -------- | ------------------------------------------------------------- |
| `address`          | string                                        | true     | The address of the account                                    |
| `subaccountNumber` | number                                        | true     | The identifier of the specific subaccount for a given address |
| `ticker`           | string                                        | false    | The market identifier (e.g., "BTC-USD", "ETH-USD")            |
| `side`             | [OrderSide](../../types/orders.md#order-side) | false    | The side of the order (e.g., "BUY" or "SELL")                 |

#### Returns

Returns an array of the following type

```typescript
interface IndexerSubaccountOrder {
  id: string;
  subaccountId: string;
  clientId: string;
  clobPairId: string;
  side: IndexerOrderSide;
  size: string;
  ticker: string;
  price: string;
  type: IndexerOrderType;
  timeInForce: IndexerTimeInForce;
  postOnly: boolean;
  reduceOnly: boolean;
  status: IndexerOrderStatus;
  orderFlags: string;
  totalFilled?: string;
  totalOptimisticFilled?: string;
  goodTilBlock?: string;
  goodTilBlockTime?: string;
  triggerPrice?: string;
  updatedAt?: string;
  updatedAtHeight?: string;
  removalReason?: string;
  createdAtHeight?: string;
  clientMetadata: string;
}
```

## Order by Id

Fetch an order by an order Id

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { IndexerSubaccountOrder } from "@klyra/core";

const orderId = "149";

const marketInfo: IndexerSubaccountOrder = await klyra.getOrder(orderId);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

order_id = "149"
response = requests.get(f"https://klyra-indexer.com/v4/orders/{order_id}")
order = response.json()
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
  curl -X GET "https://klyra-indexer.com/v4/orders/{orderId}
```

  </TabItem>
</Tabs>

#### Parameters

| Parameter | Type   | Required | Description                  |
| --------- | ------ | -------- | ---------------------------- |
| `orderId` | string | true     | The Id of the order to query |

#### Returns

```typescript
interface IndexerSubaccountOrder {
  id: string;
  subaccountId: string;
  clientId: string;
  clobPairId: string;
  side: IndexerOrderSide;
  size: string;
  ticker: string;
  price: string;
  type: IndexerOrderType;
  timeInForce: IndexerTimeInForce;
  postOnly: boolean;
  reduceOnly: boolean;
  status: IndexerOrderStatus;
  orderFlags: string;
  totalFilled?: string;
  totalOptimisticFilled?: string;
  goodTilBlock?: string;
  goodTilBlockTime?: string;
  triggerPrice?: string;
  updatedAt?: string;
  updatedAtHeight?: string;
  removalReason?: string;
  createdAtHeight?: string;
  clientMetadata: string;
}
```

## Fills

Fetch the order fills for a specific account

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { IndexerSubaccountFill } from "@klyra/core";

const address = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs";
const subaccountNumber = 0;

const marketInfo: IndexerSubaccountFill[] = await klyra.getUserFills(
  address,
  subaccountNumber
);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests
from datetime import datetime

address = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs"
subaccount_number = 0

params = {
    "address": address,
    "subaccountNumber": subaccount_number,
    "ticker": "BTC-USD",  # optional
    "createdBeforeOrAt": datetime.utcnow().isoformat(),  # optional
    "page": 1  # optional
}

response = requests.get("https://klyra-indexer.com/v4/fills", params=params)
fills = response.json()
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
  curl -X GET "https://klyra-indexer.com/v4/fills" \
   "?address={address}" \
   "&subaccountNumber={subaccountNumber}" \
   "&ticker={ticker}" \
   "&createdBeforeOrAt={ISO timestamp}" \
   "&page={page}"
```

  </TabItem>
</Tabs>

#### Parameters

| Parameter           | Type   | Required | Description                                                   |
| ------------------- | ------ | -------- | ------------------------------------------------------------- |
| `address`           | string | true     | The address of the account                                    |
| `subaccountNumber`  | number | true     | The identifier of the specific subaccount for a given address |
| `ticker`            | string | false    | The market identifier (e.g., "BTC-USD", "ETH-USD")            |
| `createdBeforeOrAt` | string | false    | The start time for the data in ISO 8601 format                |
| `page`              | number | false    | Pagination identifier                                         |

#### Returns

Returns an array of the following type

```typescript
interface IndexerSubaccountFill {
  id: string;
  subaccountId: string;
  side: IndexerOrderSide;
  liquidity: IndexerLiquidity;
  type: IndexerFillType;
  clobPairId: string;
  size: string;
  price: string;
  fee: string;
  quoteAmount?: string;
  eventId: string;
  transactionHash?: string;
  createdAt: string;
  createdAtHeight: string;
  orderId?: string;
  ticker: string;
  clientMetadata?: string;
}
```

## Transfers

Fetch the transfers made by a specific account

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { IndexerSubaccountTransfer } from "@klyra/core";

const address = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs";
const subaccountNumber = 0;

const marketInfo: IndexerSubaccountTransfer[] = await klyra.getUserTransfers(
  address,
  subaccountNumber
);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests
from datetime import datetime

address = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs"
subaccount_number = 0

params = {
    "address": address,
    "subaccountNumber": subaccount_number,
    "ticker": "BTC-USD",  # optional
    "createdBeforeOrAt": datetime.utcnow().isoformat(),  # optional
    "page": 1  # optional
}

response = requests.get("https://klyra-indexer.com/v4/transfers", params=params)
transfers = response.json()
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
  curl -X GET "https://klyra-indexer.com/v4/transfers" \
   "?address={address}" \
   "&subaccountNumber={subaccountNumber}" \
   "&ticker={ticker}" \
   "&createdBeforeOrAt={ISO timestamp}" \
   "&page={page}"
```

  </TabItem>
</Tabs>

#### Parameters

| Parameter           | Type   | Required | Description                                                   |
| ------------------- | ------ | -------- | ------------------------------------------------------------- |
| `address`           | string | true     | The address of the account                                    |
| `subaccountNumber`  | number | true     | The identifier of the specific subaccount for a given address |
| `ticker`            | string | false    | The market identifier (e.g., "BTC-USD", "ETH-USD")            |
| `createdBeforeOrAt` | string | false    | The start time for the data in ISO 8601 format                |
| `page`              | number | false    | Pagination identifier                                         |

#### Returns

Returns an array of the following type

```typescript
interface IndexerSubaccountTransfer {
  sender: {
    address: string;
    subaccountNumber?: number;
  };
  recipient: {
    address: string;
    subaccountNumber?: number;
  };
  symbol: string;
  size: string;
  type: IndexerTransferType;
  transactionHash: string;
  createdAt: string;
  createdAtHeight: string;
}
```

## PNL

Get the historical PNL's for a specific user

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { IndexerSubaccountHistoricalPnl } from "@klyra/core";

const address = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs";
const subaccountNumber = 0;

const marketInfo: IndexerSubaccountHistoricalPnl[] =
  await klyra.getUserHistoricalPNLs(address, subaccountNumber);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests
from datetime import datetime

address = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs"
subaccount_number = 0

params = {
    "address": address,
    "subaccountNumber": subaccount_number,
    "ticker": "BTC-USD",  # optional
    "createdBeforeOrAt": datetime.utcnow().isoformat(),  # optional
    "page": 1  # optional
}

response = requests.get("https://klyra-indexer.com/v4/historical-pnl", params=params)
historical_pnl = response.json()
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
  curl -X GET "https://klyra-indexer.com/v4/historical-pnl" \
   "?address={address}" \
   "&subaccountNumber={subaccountNumber}" \
   "&ticker={ticker}" \
   "&createdBeforeOrAt={ISO timestamp}" \
   "&page={page}"
```

  </TabItem>
</Tabs>

#### Parameters

| Parameter           | Type   | Required | Description                                                   |
| ------------------- | ------ | -------- | ------------------------------------------------------------- |
| `address`           | string | true     | The address of the account                                    |
| `subaccountNumber`  | number | true     | The identifier of the specific subaccount for a given address |
| `ticker`            | string | false    | The market identifier (e.g., "BTC-USD", "ETH-USD")            |
| `createdBeforeOrAt` | string | false    | The start time for the data in ISO 8601 format                |
| `page`              | number | false    | Pagination identifier                                         |

#### Returns

Returns an array of the following type

```typescript
interface IndexerSubaccountHistoricalPnl {
  id: string;
  subaccountId: string;
  equity: string;
  totalPnl: string;
  netTransfers: string;
  createdAt: string;
  blockHeight: string;
  blockTime: string;
}
```

## Subaccount Info

Get detailed information about all user subaccounts for a specified account

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { IndexerSubaccountResponse } from "@klyra/core";

const address = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs";
const subaccountNumber = 0;

const marketInfo: IndexerSubaccountResponse = await klyra.getUserSubaccountInfo(
  address,
  subaccountNumber
);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

address = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs"
subaccount_number = 0

response = requests.get(
    f"https://klyra-indexer.com/v4/addresses/{address}/subaccountNumber/{subaccount_number}"
)
subaccount_info = response.json()
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
curl -X GET "https://klyra-indexer.com/v4/addresses/{address}/subaccountNumber/{subaccountNumber}"
```

  </TabItem>
</Tabs>

#### Parameters

| Parameter          | Type   | Required | Description                                                   |
| ------------------ | ------ | -------- | ------------------------------------------------------------- |
| `address`          | string | true     | The address of the account                                    |
| `subaccountNumber` | number | true     | The identifier of the specific subaccount for a given address |

#### Returns

```typescript
interface IndexerSubaccountResponse {
  address: string;
  subaccountNumber: number;
  equity: string;
  freeCollateral: string;
  openPerpetualPositions: Record<
    string,
    IndexerSubaccountPerpetualPositionSubscribed
  >;
  assetPositions: Record<string, IndexerSubaccountAssetPosition>;
  marginEnabled: boolean;
  updatedAtHeight: string;
  latestProcessedBlockHeight: string;
}
```

## All Subaccount Info

Get detailed information about all user subaccounts for a specified account

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { IndexerSubaccountResponse } from "@klyra/core";

const address = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs";

const marketInfo: IndexerSubaccountResponse[] =
  await klyra.getAllUserSubaccountsInfo(address);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

address = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs"
params = {"address": address}

response = requests.get("https://klyra-indexer.com/v4/addresses/", params=params)
all_subaccounts_info = response.json()
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
curl -X GET "https://klyra-indexer.com/v4/addresses/?address={address}"
```

  </TabItem>
</Tabs>

#### Parameters

| Parameter | Type   | Required | Description                |
| --------- | ------ | -------- | -------------------------- |
| `address` | string | true     | The address of the account |

#### Returns

Returns an array of the following type

```typescript
interface IndexerSubaccountResponse {
  address: string;
  subaccountNumber: number;
  equity: string;
  freeCollateral: string;
  openPerpetualPositions: Record<
    string,
    IndexerSubaccountPerpetualPositionSubscribed
  >;
  assetPositions: Record<string, IndexerSubaccountAssetPosition>;
  marginEnabled: boolean;
  updatedAtHeight: string;
  latestProcessedBlockHeight: string;
}
```
