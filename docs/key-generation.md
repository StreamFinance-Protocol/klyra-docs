---
sidebar_position: 7
description: Learn about KlyraSDK key generation
---

# Key Generation
On the KlyraSDK, private keys for each user are derived from a random, unique, and persistent 65 byte string. Key generation is done through a variety of getter functions. These getter functions are called with some unique string(s) and returns a [`WalletSubaccountInfo`](./types/accounts.md#wallet-subaccount-info), [`LocalWallet`](./types/accounts.md#local-wallet), and an account address. Below are things you should be aware of depending on how you are using the KlyraSDK.

## From UUID

```typescript
import { WalletSubaccountInfo } from "@klyra/core";

const uuid ="0000000000000000000000000000000000000000000000000000000000000000000" // fetch from your DB
const subaccountNumber = 0; // optional

// also returns wallet and address, but we omit for simplicity
const { subaccount: WalletSubaccountInfo } = await klyra.getSubaccountFromUUID(uuid, subaccountNumber) 
```

When using the KlyraSDK server side, a common pattern is to hold custody over a user's Klyra private key; or more specifically hold custody over the unique 65 byte string that the private key is derived from. For all intensive purposes, we can call this a unique user identifier (UUID). Usually on server side use cases, this UUID will be generated for each user and stored on a database. **It's of upmost importance that this UUID is kept secret and securely. If someone get's the UUID of another user they can steal funds**. Therefore the UUID should be generated with enough randomness. Additionally since the same key needs to be derived each time, it's important that the UUID of a user never changes.

:::note
The UUID doesn't need to be 65 bytes exactly. The KlyraSDK will either append 0's or truncate until the UUID is 65 bytes in length
:::

## From Signature
```typescript
import { WalletSubaccountInfo } from "@klyra/core";

const signature = "0000000000000000000000000000000000000000000000000000000000000000000" // signed message from user
const subaccountNumber = 0; // optional

// also returns wallet and address, but we omit for simplicity
const { subaccount: WalletSubaccountInfo } = await klyra.getSubaccountFromSignature(signature, subaccountNumber) 
```

The other option to get a user's Klyra private key is by using their ethereum private key. This is a common pattern in client side implementations where you don't hold custody over the Klyra private key. In this scheme, a user will sign a fixed message created by the client in their injected wallet on the browser. This message could be signed to fetch the signature each time, or it could be signed once and the signature is stored securely in browser storage.

:::warning
Ensure that the message that is being signed is fixed every time so the private key that is derived is deterministic
:::

## Existing Key
```typescript
import { WalletSubaccountInfo, LocalWallet } from "@klyra/core";

const mnemonic = "klyra klyra klyra klyra klyra klyra klyra klyra klyra klyra klyra klyra"
const bech32Prefix = "klyra" // always "klyra"
const wallet: LocalWallet = await LocalWallet.fromMnemonic(mnemonic, bech32Prefix);
const subaccountNumber = 0 // optional
const subaccount: WalletSubaccountInfo = new WalletSubaccountInfo(wallet, subaccountNumber)
```


In some cases, you may want to create a subaccount object (i.e., `WalletSubaccountInfo`) from a private key that is held in custody individually. The common case here is when you're an individual trader maintaining a key and you wish to trade using the KlyraSDK.

:::note
You should keep your mnemonic secure. A common pattern is to put this in your .env file
:::