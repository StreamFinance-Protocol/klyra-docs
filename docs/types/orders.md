---
sidebar_position: 1
description: Explore order paremeter types 
---

# Order Types

Formal documentation for different types used to place and cancel orders

## Order Side
Specifies which side of the orderbook the order is placed on

 ```typescript
  enum OrderSide {
    BUY = "BUY",
    SELL = "SELL"
  }
```

## Order Type
Specifies the type of the order. Useful for [`placeCustomOrder`](../api-methods/transactions/placing-orders.md)
 ```typescript
enum OrderType {
    LIMIT = "LIMIT",
    MARKET = "MARKET",
    STOP_LIMIT = "STOP_LIMIT",
    STOP_MARKET = "STOP_MARKET",
    TAKE_PROFIT_LIMIT = "TAKE_PROFIT_LIMIT",
    TAKE_PROFIT_MARKET = "TAKE_PROFIT_MARKET",
    TRAILING_STOP = "TRAILING_STOP",
    LIQUIDATED = "LIQUIDATED",
    LIQUIDATION = "LIQUIDATION",
    OFFSETTING = "OFFSETING",
    DELEVERAGED = "DELEVERAGED",
    FINAL_SETTLEMENT = "FINAL_SETTLEMENT"
}
```

## Time In Force
Specifies how the order should act with respect to time
- **GTT (Good Til Time)**: If set to GTT, then the order will expire after a certain amount of time in seconds
- **IOC (Immediate or Cancel)**: If set to IOC, then the order will be attempted to match immediately, and any remaining amount will be canceled
```typescript
enum OrderTimeInForce {
    GTT = "GTT",
    IOC = "IOC"
}
```

## Order Execution
Specifies how the order should be executed
- **DEFAULT**: for conditional orders, setting to default indicates the triggered order should be handled as a regular limit order
- **IOC (Immediate or Cancel)**: for condiitonal orders, setting to IOC indicated the triggered order should be handled as a market order
- **POST_ONLY**: Inidicates the order should fail if it matches, instead it should only be placed on the orderbook as a maker order
```typescript
enum OrderExecution {
    DEFAULT = "DEFAULT",
    IOC = "IOC",
    POST_ONLY = "POST_ONLY"
}
```

## Market Info
Indentifies a market on Klyra. All of these values are set in state on Klyra
- **clobPairId**: The Id of the clob pair on Klyra
- **atomicResolution**: The smallest unit of measurement for a given market is 10^(atomicResolution)
- **stepBaseQuantums**: The smallest unit of an asset you can buy or sell
- **quantumConversionExponent**: The conversion exponent to go from base to quote qunatums
- **subticksPerTick**: The smallest change in price for a given market
```typescript
export interface MarketInfo {
  clobPairId: number;
  atomicResolution: number;
  stepBaseQuantums: number;
  quantumConversionExponent: number;
  subticksPerTick: number;
}
```
## Broadcast Tx Asynchronous Response 
The response received after submitting a succesful order
``` typescript
interface BroadcastTxAsyncResponse {
    readonly hash: Uint8Array;
}
```



