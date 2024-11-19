---
sidebar_position: 1
description: What are Perpetual Futures?
---

# Perpetuals Overview
An overview on how Perpetual Future Contracts work in practice.

## Introductory
Financial products can fundamentally be divided into two broad categories: spot products, and derivative products. 

### Spot Products
Spot products deal with the actual underlying asset - when you own a spot product, you own the asset itself. The simplest example is a swap between two assets: if I have BTC and want USDC, I own the actual BTC before the swap and the actual USDC after.

### Derivative Products
Derivative products are financial tools that derive their value from an underlying asset without requiring ownership of it. When you own a derivative product you don’t own the underlying asset. Derivatives are structured as a mutual agreement between two parties. For example, let's say Alice thinks the price of BTC will rise and Bob thinks it will fall. Alice and Bob agree that for every \$100 price increase in BTC, Bob will pay Alice \$500 (and vice versa if the price falls). This contract derives its value from BTC's price but doesn't involve owning any BTC.

A common derivative is a Perpetual Futures Contract (or "perp" for short). Perps allow traders to use leverage, meaning they can control a larger position than their available capital would normally allow. When trading a perp, a trader can either be long or short:

1. **Long**: The trader profits when the underlying asset's price increases.
2. **Short**: The trader profits when the underlying asset's price decreases. 

### Perp Example
Let's say you have \$1,000. With a perp, you can control \$10,000 worth of BTC using just your \$1,000. This is called "10x leverage" because your trading power is multiplied by 10.

Here's how it works:
- If BTC's price rises from \$50,000 to \$55,000 (a 10% increase):
  - With a perp: Your \$10,000 position gains \$1,000 (10% of \$10,000)
  - With spot: Your \$1,000 of BTC would only gain \$100 (10% of \$1,000)

This shows how perps can multiply both profits AND losses by your leverage amount (10x in this example). This makes perps higher risk but potentially higher reward than buying the asset directly.

Remember: When you trade a perp, you never own the actual BTC - it's just an agreement between traders that tracks BTC's price. Think of it as a way to trade with more purchasing power than you actually have.

## Advanced
Now that we understand why perps exist—to provide leverage for longing or shorting assets without requiring ownership of the asset—let's explore the mechanisms that make them work.

### Funding Rates
The first big open question is how the price of a perp tracks the price of the underlying asset. Funding rates solve this by incentivizing traders to align the perp price with the underlying price. They are periodic payments between long and short traders, based on the difference between the perp price and the [oracle-reported](./oracle.md) price of the underlying asset.

How It Works:
- If the perp price is **above** the underlying price, long traders pay funding to short traders.
- If the perp price is **below** the underlying price, short traders pay funding to long traders.

This mechanism works because going long increases the perp price, while going short decreases it. For example:
- If the perp is **overpriced**, shorting earns funding and longs pay funding. This incentivizes traders to:
  1. Open short positions (driving the price down)
  2. Close long positions (further driving the price down)
- If the perp is **underpriced**, longing earns funding and shorts pay funding. This incentivizes traders to:
  1. Open long positions (driving the price up)
  2. Close short positions (further driving the price up)

The magnitude of the funding rate grows with the deviation between the perp and underlying price, increasing incentives to trade and realign the two. On Klyra, funding rates are paid hourly.

For details on funding rate calculations, see [here](./funding-rates.md). For now, understand funding rates as a mechanism that keeps the perp price closely tied to the underlying asset.

### Collateral
Collateral (sometimes also called margin) is the capital a trader deposits to back their positions on a perpetual exchange. It determines a trader's buying power, which is a multiple of the collateral amount based on leverage. For example, with 10x leverage, a trader can control a position worth 10 times their collateral.

Why Collateral Is Important:
- Collateral ensures that a trader who incurs losses (also called negative PNL, which stands for "profits and losses") has enough funds to cover the profits of their counterparty. In a trade, counterparties (e.g., Alice and Bob, one long and one short) effectively "win" or "lose" each other’s collateral based on the price movement.

Leverage and Risk:
- Higher leverage increases risk because PNL is amplified by the leverage multiple. For instance, at 20x leverage, a small adverse price move can quickly deplete a trader's collateral. Lower leverage (e.g., 2x) provides more buffer against price fluctuations, reducing the risk of losing all collateral.

In short, collateral ensures the integrity of the trading system by safeguarding counterparty payouts and aligning risk with position size.

### Liquidations
At their core, perps are an agreement between two parties, so what happens when the price moves and one trader's collateral is depleted to zero? Let's use an example:

Alice and Bob open a perp against each other with Alice long BTC and Bob short BTC. The BTC price rises until Bob's losses equal his collateral. A simple solution would be to force-close both positions: Bob's collateral would be sent to Alice, and both traders exit their positions.

However, this creates a poor user experience for Alice: What if she didn't want to close her position? This is why Klyra implements liquidations, which transfer Bob's position to a new trader. Instead of closing Alice's position, she gets a new counterparty while only Bob is forced out (since he has no more collateral to cover potential losses).

Liquidations ensure exchange solvency by preventing negative collateral. If a trader had negative collateral, their counterparty would have profits that couldn't be paid out. A key invariant of Klyra is that total net PNL must be zero (i.e., if someone makes \$X, another trader must lose \$X). To prevent negative collateral scenarios, liquidations occur slightly before a trader's collateral reaches zero, giving the exchange time to find a new counterparty.

Find exactly how liquidations work on Klyra [here](./liquidations.md).