---
sidebar_position: 8
description: Learn about Klyra's custody management
---

# Custody
Klyra custody operates similarly to Ethereum or Bitcoin custody: user funds are held securely on-chain in accounts controlled by private keys. These keys are held either by users themselves or by their trusted exchange (not by Klyra). Anyone can create an account by generating a private key, but must safeguard these keys to prevent loss of funds. 

For exchanges, the simplest approach is to use one account per user, which allows Klyra to handle all accounting directly. For more advanced integrations, services can use a single account to manage multiple users by utilizing [subaccounts](./accounting#subaccounts) or custom logic. While this approach can reduce fees and minimize risks through position aggregation, it requires more sophisticated implementation.