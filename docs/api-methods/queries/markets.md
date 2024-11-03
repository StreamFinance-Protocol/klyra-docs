---
sidebar_position: 2
description: Fetch market data from Klyra
---

# Markets

Fech all the data related to market specific information

## Market Info

Get all market data for a specific Klyra market

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { IndexerPerpetualMarket } from "@klyra/core";

const ticker = "BTC-USD";

const marketInfo: IndexerPerpetualMarket = await klyra.getMarketInfo(ticker);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

ticker = "BTC-USD"
response = requests.get(f"https://klyra-indexer.com/v4/perpetualMarkets/{ticker}")
market_info = response.json()
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
  curl -X GET "https://klyra-indexer.com/v4/perpetualMarkets/{ticker}"
```

  </TabItem>
</Tabs>

#### Parameters

| Parameter | Type   | Required | Description                                        |
| --------- | ------ | -------- | -------------------------------------------------- |
| `ticker`  | string | true     | The market identifier (e.g., "BTC-USD", "ETH-USD") |

#### Returns

```typescript
interface IndexerPerpetualMarket {
  clobPairId: string;
  ticker: string;
  status: IndexerPerpetualMarketStatus;
  oraclePrice: string;
  priceChange24H: string;
  volume24H: string;
  trades24H: number;
  nextFundingRate: string;
  initialMarginFraction: string;
  maintenanceMarginFraction: string;
  openInterest: string;
  atomicResolution: number;
  quantumConversionExponent: number;
  tickSize: string;
  stepSize: string;
  stepBaseQuantums: string;
  subticksPerTick: string;
  marketType: IndexerPerpetualMarketType;
  openInterestLowerCap: string;
  openInterestUpperCap: string;
}
```

## Market Candles

Fetch candles for a speicifc market

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { IndexerCandleContents } from "@klyra/core";

const ticker = "BTC-USD";
const resolution = "1MIN";

const candles: IndexerCandleContents[] = await klyra.getMarketCandles(
  ticker,
  resolution
);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests
from datetime import datetime, timedelta

ticker = "BTC-USD"
resolution = "1MIN"

# Example date range for the last 24 hours
to_iso = datetime.utcnow().isoformat()
from_iso = (datetime.utcnow() - timedelta(days=1)).isoformat()

params = {
    "resolution": resolution,
    "fromISO": from_iso,
    "toISO": to_iso
}

response = requests.get(
    f"https://klyra-indexer.com/v4/candles/perpetualMarkets/{ticker}",
    params=params
)
candles = response.json()
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
curl -X GET "https://klyra-indexer.com/v4/candles/perpetualMarkets/{ticker}" \
     "?resolution={resolution}" \
     "&fromISO={fromISO}" \
     "&toISO={toISO}"
```

  </TabItem>
</Tabs>

#### Parameters

| Parameter    | Type                                                       | Required | Description                                        |
| ------------ | ---------------------------------------------------------- | -------- | -------------------------------------------------- |
| `ticker`     | string                                                     | true     | The market identifier (e.g., "BTC-USD", "ETH-USD") |
| `resolution` | [string](../../types/markets.md#candle-resolution-options) | true     | The time interval for the market candles           |
| `fromISO`    | string                                                     | true     | The start time for the data in ISO 8601 format     |
| `toISO`      | string                                                     | true     | The end time for the data in ISO 8601 format       |

#### Returns

Returns an array of the following type

```typescript
interface IndexerCandleContents {
  startedAt: string;
  resolution: IndexerCandleResolution;
  ticker: string;
  low: string;
  high: string;
  open: string;
  close: string;
  baseTokenVolume: string;
  usdVolume: string;
  trades: number;
  startingOpenInterest: string;
  orderbookMidPriceOpen: string;
  orderbookMidPriceClose: string;
}
```

## Market Orderbook

Fetch the current orderbook of a specified market
<Tabs>
<TabItem value="typescript" label="TypeScript" default>

```typescript
import { IndexerOrderbook } from "@klyra/core";

const ticker = "BTC-USD";

const orderbook: IndexerOrderbook = await klyra.getOrderbook(ticker);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

ticker = "BTC-USD"
response = requests.get(f"https://klyra-indexer.com/v4/orderbooks/perpetualMarket/{ticker}")
orderbook = response.json()
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
curl -X GET "https://klyra-indexer.com/v4/orderbooks/perpetualMarket/{ticker}"
```

  </TabItem>
</Tabs>

#### Parameters

| Parameter | Type   | Required | Description                                        |
| --------- | ------ | -------- | -------------------------------------------------- |
| `ticker`  | string | true     | The market identifier (e.g., "BTC-USD", "ETH-USD") |

#### Returns

```typescript
interface IndexerOrderbook {
  asks?: IndexerOrderbookEntry[];
  bids?: IndexerOrderbookEntry[];
}
```

:::note
Explore the [IndexerOrderbookEntry type](../../types/markets.md#indexer-orderbook-entry)
:::

## Historical Funding Rates

Fetch the historical funding rates for a specified market

<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

```typescript
import { IndexerHistoricalFunding } from "@klyra/core";

const ticker = "BTC-USD";

const fundingRates: IndexerHistoricalFunding[] =
  await klyra.getHistoricalFundingRates(ticker);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

ticker = "BTC-USD"
response = requests.get(f"https://klyra-indexer.com/v4/historicalFunding/{ticker}")
funding_rates = response.json()
```

  </TabItem>
  <TabItem value="curl" label="cURL">

```bash
curl -X GET "https://klyra-indexer.com/v4/historicalFunding/{ticker}"
```

  </TabItem>
</Tabs>

#### Parameters

| Parameter | Type   | Required | Description                                        |
| --------- | ------ | -------- | -------------------------------------------------- |
| `ticker`  | string | true     | The market identifier (e.g., "BTC-USD", "ETH-USD") |

#### Returns

Returns an array of the following type

```typescript
interface IndexerHistoricalFunding {
  ticker: string;
  rate: string;
  price: string;
  effectiveAtHeight: string;
  effectiveAt: string;
}
```
