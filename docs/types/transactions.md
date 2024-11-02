---
sidebar_position: 3
description: Explore transaction types
---

# Transaction Types
Transaction types are those that are used in the response from [transaction methods](../api-methods/transactions/placing-orders.md)

## Tx Response
The response of all transactions placed through the KlyraSDK
```typescript
type TxResponsePromise = Promise<BroadcastTxAsyncResponse | BroadcastTxSyncResponse | IndexedTx>;
```

## Broadcast Tx Asynchronous Response 
The response received after submitting a succesful order asynchronously
``` typescript
interface BroadcastTxAsyncResponse {
    readonly hash: Uint8Array;
}
```

## Broadcast Tx Sync Response 
The response received after submitting a succesful order snychronously
``` typescript
interface BroadcastTxSyncResponse extends TxData {
    readonly hash: Uint8Array;
}
```

## Indexed Tx
The response received from a transaction by the Klyra Indexer
```typescript
interface IndexedTx {
    readonly height: number;
    readonly txIndex: number;
    readonly hash: string;
    readonly code: number;
    readonly events: readonly Event[];
    readonly rawLog: string;
    readonly tx: Uint8Array;
    readonly msgResponses: Array<{
        readonly typeUrl: string;
        readonly value: Uint8Array;
    }>;
    readonly gasUsed: bigint;
    readonly gasWanted: bigint;
}
```


## Tx Data
Data related to a transaction
```typescript
interface TxData {
    readonly code: number;
    readonly codespace?: string;
    readonly log?: string;
    readonly data?: Uint8Array;
    readonly events: readonly Event[];
    readonly gasWanted: bigint;
    readonly gasUsed: bigint;
}
```

## Event
Events emitted by Klyra for a transaction
```typescript
interface Event {
    readonly type: string;
    readonly attributes: readonly Attribute[];
}
```

## Attribute
A single value for a transaction event
```typescript
interface Attribute {
    readonly key: Uint8Array;
    readonly value: Uint8Array;
}
```




