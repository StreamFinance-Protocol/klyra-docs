---
sidebar_position: 2
description: Explore the market query types
---

# Market Types

## Candle Resolution Options
The options for different timelengths when fetching candles for markets

- "1MIN"
- "5MINS"
- "15MINS"
- "30MINS"
- "1HOUR"
- "4HOURS"
- "1DAY"

## Indexer Orderbook Entry
An orderbook entry used in the return type of orderbook queries

```typescript
interface IndexerOrderbookEntry {
  size: string;
  price: string;
}
```