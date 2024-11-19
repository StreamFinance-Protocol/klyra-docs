---
sidebar_position: 1
description: What are Perpetual Futures?
---

# Perpetuals Overview
An overview on how Perpetual Future Contracts work in practice.

## Introductory
Financial products can fundamentally be divided into two broad categories: spot products, and derivative products. 

### Spot Products
Spot products deal with the actual underlying asset; in other words when you own a spot product you own the actual asset. The simplest example of a spot product is a swap between two assets. Say I have BTC and I want USDC. When I swap the BTC for USDC I own the actual BTC asset before the swap, and after the swap I own the actual USDC asset.

### Derivative Products
On the other hand, derivative products are financial tools that derive their value from an underlying asset. Although they derive their value from an underlying asset, when you own a derivative product you don’t own the underlying asset. Derivatives are structured as a mutual agreement between two parties. For example, let's say Alice thinks the price of BTC will go up and Bob thinks it will go down. Alice and Bob craft an agreement that every \$100 the price of BTC increases, Bob will pay Alice \$500, and the inverse if the price goes down. Well now Alice and Bob have a contract (the derivative) that derives its value from the underlying BTC price, but doesn’t require the ownership of the asset in any way.

A common type of a derivative is a Perpetual Futures Contract, or perps for short. It’s one type of derivative product that allows for trading an asset with leverage. Trading with leverage means that you get more exposure to the underlying asset than the amount of money you have. When purchasing a perp you have two options: long or short the asset. Longing the asset means the trader makes money when the price of the underlying asset increases. Shorting means the trader makes money when the price of the underlying asset decreases. 

### Perp Example
Say you have \$1,000. With a perp, you can get for example \$10,000 of BTC exposure (simulate the profits and losses of a position worth \$10,000) with just \$1,000. You would call this being 10x leveraged. So, the profit or loss is multiplied by 10 in this example. If the BTC price is \$50,000 when you purchase the perp (assuming you go long), and then the price of BTC rises to \$55,000 (+10%), then your profit is \$1,000. Instead, if you just bought spot BTC and not the perp, then you would have owned only \$1,000 of BTC and your profit would be \$100. So when you are 10x long, then profits or losses are multiplied by 10. 

Consequently, perps are higher risk, but higher reward than buying the spot asset, since the price movements are exaggerated. Perps offer a nice user experience because the price of the perp tracks the price of the underlying asset through some unique mechanism specific to perps. At a high level, it can simply be thought of as a way for traders to increase their purchasing power. It’s important to remember that because a perp is a derivative, when you buy a perp you never actually own the underlying asset, it’s just a mutual agreement between two traders.

## Advanced
With the intuition as to why perps are needed and what they enable–i.e., accessing high amounts of leverage to long or short a particular asset–we can expand on the mechanisms that enable such a derivative product. 

### Funding Rates
The first big open question is how the price of a perp tracks the price of the underlying asset. Funding rates solve this by incentivizing traders to align the perp price with the underlying price. They are periodic payments between long and short traders, depending on the relationship between the perp price and the [oracle-reported](./oracle.md) price of the underlying asset.


How It Works:
- If the perp price is **above** the underlying price, long traders pay funding to short traders.
- If the perp price is **below** the underlying price, short traders pay funding to long traders.

This mechanism works because going long increases the perp price, while going short decreases it. For example:
- If the perp is **overpriced**, shorting earns funding. Traders are incentivized to go short, driving the price down.
- If the perp is **underpriced**, longing earns funding. Traders are incentivized to go long, driving the price up.

The magnitude of the funding rate grows with the deviation between the perp and underlying prices, increasing incentives to trade and realign the two. On Klyra, funding rates are paid hourly.

For details on funding rate calculations, see [here](./funding-rates.md). For now, understand funding rates as a mechanism that keeps the perp price closely tied to the underlying asset.

### Collateral
Collateral (sometimes also called margin) is the capital a trader deposits to back their positions on a perpetual exchange. It determines a trader's buying power, which is a multiple of the collateral amount based on leverage. For example, with 10x leverage, a trader can control a position worth 10 times their collateral.

Why Collateral Is Important:
- Collateral ensures that a trader who incurs losses (negative profits and losses (PNL)) has enough funds to cover the profits of their counterparty. In a trade, counterparties (e.g., Alice and Bob, one long and one short) effectively "win" or "lose" each other’s collateral based on the price movement.

Leverage and Risk:
- Higher leverage increases risk because PNL is amplified by the leverage multiple. For instance, at 20x leverage, a small adverse price move can quickly deplete a trader's collateral. Lower leverage (e.g., 2x) provides more buffer for price fluctuations, reducing the risk of losing all collateral.

In short, collateral ensures the integrity of the trading system by safeguarding counterparty payouts and aligning risk with position size.

### Liquidations
At their core, perps are an agreement between two parties, so what happens when the price moves and one trader’s collateral is depleted to zero? Let’s assume Alice and Bob open a perp against each other with Alice long BTC and Bob short BTC. Now the price of BTC rises and Bob’s short is losing so much money to the point where his losses are at the same amount as his collateral. One thing an exchange could do is to force the closure of this position on both sides. So Alice and Bob both get out of the position and Bob gets his collateral sent to Alice to provide Alice’s profits. However, this creates a very strange user experience for Alice: What if Alice didn’t want to close her position? For this reason, Klyra implements a mechanism called liquidations which in this example would facilitate the transfer of Bob’s position to a new trader. Now,  instead of closing Alice’s position, Alice has a new counterparty and only Bob is forced out of his position since he has no more collateral to pay out the profit of his counterparty. 

Liquidations ensure the solvency of an exchange. In other words, they make sure that a trader never has negative collateral. If such a case were to arise, a trader would have profits that can’t be paid out because that PNL can’t be supplied by the counterparty’s collateral. An invariant of Klyra is that the total net PNL of traders is zero (i.e., if someone makes \$X, some other trader made \$-X). A trader with negative collateral is the worst thing that can happen to a perps exchange. To combat this, liquidations don’t occur when a trader’s collateral is exactly zero. Instead liquidations occur a bit before the collateral reaches zero to allow the exchange to find a new counterparty for the position.

Find exactly how liquidation work on Klyra [here](./liquidations.md)




