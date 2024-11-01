---
sidebar_position: 4
description: Transfer assets between accounts
---

# Transfer Methods
Transfer methods are the way to transfer assets between accounts on Klyra

## Transfer

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


<Tabs>
  <TabItem value="typescript" label="TypeScript" default>

  ```typescript
  import { WalletSubaccountInfo, TxResponsePromise } from '@klyra/chain';
  
  const subaccount = new WalletSubaccountInfo(wallet, 0);
  const recipientAddress = "klyra10fx7sy6ywd5senxae9dwytf8jxek3t2gcen2vs";
  const recipientSubaccountNumber = 0;
  const amount = "100"
  
  const tx: TxResponsePromise = await klyra.transfer(
    subaccount,
    recipientAddress
    recipientSubaccountNumber,
    amount
  );
  ```

  </TabItem>
  <TabItem value="curl" label="cURL">

  ```bash
  curl -X POST https://klyra-node-1.com/placeOrder \
    -H "Content-Type: application/json" \
    -d '{
      "subaccount": "0",
      "clientId": 123,
      "clobPairId": 0,
      "side": "SIDE_BUY",
      "quantums": 1000000000,
      "subticks": 1000000000,
      "timeInForce": "TIME_IN_FORCE_UNSPECIFIED",
      "orderFlags": "SHORT_TERM",
      "reduceOnly": false
    }'
  ```

  </TabItem>
</Tabs>


<br />
A transfer transaction will transfer an asset between subaccounts
<br />

| Parameters                  | Required | Type           | Description                                          |
| --------------------------- | -------- | -------------- | ---------------------------------------------------- |
| `subaccount`                | true     | SubaccountInfo | The subaccount the order is on behalf of             |
| `recipientAddress`          | true     | string         | The recipient of the funds                           |
| `recipientSubaccountNumber` | true     | number         | The subaccount of the recipient the funds will go to |
| `amount`                    | true     | string         | The amount of asset to send                          |