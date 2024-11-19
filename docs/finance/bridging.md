---
sidebar_position: 9
description: How does Klyra handle bridging?
---

# Bridging

## Introductory
Initially, Klyra will launch with a bridge to Ethereum, enabling users to transfer funds safely between the two networks. When users send funds to an Ethereum smart contract, the equivalent amount is credited to their Klyra account. Similarly, when users withdraw from Klyra, the funds are released on Ethereum. This system ensures that the total assets on Klyra always match the total assets in the Ethereum smart contract, providing secure and reliable transfers between the two networks.

## Advanced
Our bridging solution is currently being developed, and we are open to discussing the design to ensure the easiest and most efficient solution for both clients and users. Since Klyra operates as a chain, we can leverage its validator set to build a bridge that inherits Klyra's full security. 
Initially, we are building a bridge between Klyra and Ethereum. To deposit funds on Klyra, users send funds to an Ethereum smart contract, which is not controlled by a master key. Once this transaction is included in a block on Ethereum, Klyra validators, each running an independent Ethereum light client, can independently verify the transaction. A light client is a simplified Ethereum node that only stores a subset of the blockchain’s data, allowing the Klyra validators to reach consensus on the fact that the user has deposited funds into the Ethereum smart contract. Once the deposit transaction is verified by Klyra validators, funds are credited to the user's Klyra account.
The key invariant in this process is that the total assets on Klyra always equal the total assets held in the Ethereum smart contract, ensuring that funds are always accounted for correctly.
For withdrawals, users initiate a transaction on Klyra, and Klyra validators confirm that the user has sufficient funds on the chain. If the conditions are met, validators provide a threshold signature—requiring a >2/3 majority, the same condition as in Klyra's consensus algorithm. A threshold signature is a cryptographic signature that can only be created if a sufficient number of validators agree, providing security and assurance. This signature is then validated on the Ethereum smart contract, and if valid, funds are released to the user.
This bridge design offers the highest security guarantees possible for transferring assets between Ethereum and Klyra, inheriting the full security of both networks (min(Klyra, Ethereum)) in both directions.
