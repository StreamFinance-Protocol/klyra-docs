---
sidebar_position: 8
description: Learn about Klyra's custody management
---

# Custody
Klyra custody functions the same way as Ethereum or Bitcoin custody, user funds are held securely on-chain in accounts controlled by private keys held by the users or a service provider trusted by the users (not Klyra). Anyone can create an account by generating a private key, and must ensure these keys are stored safely to prevent loss of funds. The simplest setup is one account per user, allowing Klyra to handle all accounting directly. Alternatively, services integrating with Klyra can use a single account for multiple users, leveraging subaccounts (explained in the accounting section) or custom logic to manage funds. This approach may reduce fees and risks through position aggregation but requires a more advanced integration.