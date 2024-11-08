---
sidebar_position: 3
description: Explore the wallet types
---

# Account Types
Account types are those that are used to handle user wallets

## Local Wallet
The local wallet is an object that is used by the KlyraSDK under the hood to sign transactions and manage a user's wallet. You don't need to directly use this object, unless you want to
```typescript
class LocalWallet {
    private readonly offlineSigner;
    private readonly accounts;
    private readonly address;
    private readonly pubKey;
    private readonly transactionSigner;
    private constructor();
    static fromOfflineSigner(signer: OfflineSigner): Promise<LocalWallet>;
    static fromMnemonic(mnemonic: string, prefix?: string): Promise<LocalWallet>;
    getAccounts(): readonly AccountData[];
    getAddress(): string;
    getPubKey(): Secp256k1Pubkey;
    signTransaction(messages: readonly EncodeObject[], transactionOptions: TransactionOptions, fee?: StdFee, memo?: string): Promise<Uint8Array>;
}
```

## Wallet Subaccount Info
The wallet subaccount info is an object that represents a subaccount on Klyra. This is the object that will get passed to all [place order methods](../api-methods/transactions/placing-orders.md), and is a wrapper around `LocalWallet`
```typescript
class WalletSubaccountInfo {
    readonly wallet: LocalWallet;
    readonly subaccountNumber: number;
    constructor(wallet: LocalWallet, subaccountNumber?: number);
    get address(): string;
}
```

