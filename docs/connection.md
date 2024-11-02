---
sidebar_position: 2
description: Learn how to connect to klyra
---

# Connect
Connections should be created in the entry point of your application so the same instance can be used across your project

## Configuration
To utilize the KlyraSDK you will need to first create an instance with the appropriate configuration for you. Configuration consists of things like both which enviroment you are attempting to connect to and default fee parameters.

```typescript
import { Klyra } from "@klyra/core";


const klyra = new Klyra({
  environment: "testnet", // the environment of this instance
  fees: {
    feePpm: 1000 // the parts per million of default fees per order
    address: "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs" // the address the fees should be transferred to
    subaccountNumber: 0 // the subaccount of the address the fees should be transferred into
  }
});
```

#### Options
- **environment**: The environment that the instance is connected to `testnet` or `mainnet`
- **fees**: The default configuration for fees captured by the exchange per order. This is the default value, but adjusting fees dynamically on a per order basis can also be accomplished when calling transaction methods


## Initialization
Initializing the instance you just created is will connect your application to both Klyra Nodes through GRPC and the Klyra Indexer through websocket

```typescript
klyra.initialize();
```


