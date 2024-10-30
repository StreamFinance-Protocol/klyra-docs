---
sidebar_position: 1
---

# Overview

Learn how to connect to **Klyra**

## Getting Started

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

This will install the KlyraSDK, allowing you to interact with the Klyra protocol.

:::note
  You will need [Node.js](https://nodejs.org/en/download/) version 18.0 or above
:::

## Initialize KlyraSDK
```typescript
import { Klyra } from "@klyra/core";



const klyra = new Klyra({
  environment: "testnet",
  withCortexForms: false,
  websocket: {
    subscribeOnConnect: [],
  },
});

klyra.initialize();
```

Run this in the entry point of your project to create and initialize and instance of the KlyraSDK
