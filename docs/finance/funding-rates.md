---
sidebar_position: 2
description: What are funding rates?
---

# Funding Rates

![funding payment diagram](../../static/img/funding-diagram.png)

## Introductory
Funding rates help keep the price of a perpetual contract in line with the price of the actual asset it represents. They are periodic payments between long and short traders, based on the difference between the perp price and the [oracle-reported](./oracle.md) price of the underlying asset.

How It Works:
- If the perp price is **above** the underlying price, long traders pay funding to short traders.
- If the perp price is **below** the underlying price, short traders pay funding to long traders.

The funding rate therefore creates incentives to correct the perp price:
- If the perp price is **above** the underlying asset's price, shorts earn funding and longs pay funding. This incentivizes traders to:
  1. Open short positions (driving the price down)
  2. Close long positions (driving the price down)
  3. Profit by selling perps and buying the asset until prices converge (further driving the price down)
- If the perp price is **below** the underlying asset's price, longs earn funding and shorts pay funding. This incentivizes traders to:
  1. Open long positions (driving the price up)
  2. Close short positions (driving the price up)
  3. Profit by buying perps and selling the asset until prices converge (further driving the price up)

This system automatically adjusts based on the size of the price difference. On Klyra, funding payments occur hourly to maintain alignment.

## Advanced
### Funding Rate Components and Calculation
The funding rate has two components:
1. Premium: Calculated separately for each market based on the perpetual's market price
2. Interest rate

On Klyra, every validator calculates the premium for a given market based on these steps:
- Every second: Validators sample the premium based on price differences
- Every minute: Second-by-second samples are averaged
- Every hour: The past 60 minute averages are combined into a final premium. The median of all validators' premiums is used as the canonical premium for a market.

### Hourly Settlement
The final funding rate combines the premium with the interest rate and settles hourly. This ensures that price corrections are timely and responsive to market conditions.

Hourly settlement strikes an effective balance. Settling too infrequently risks allowing prices to deviate significantly from the underlying price, while hourly intervals ensure timely corrections. Hourly funding is also practical because the costs of opening and closing positions typically exceed the funding fees accrued within an hour, making it difficult to game the system. Additionally, settling every hour keeps computational costs manageable while maintaining responsiveness.

### Premium Calculation
Every second, the premium is sampled as follows:

`Premium = (Max(0, Impact Bid Price - Index Price) - Max(0, Index Price - Impact Ask Price)) / Index Price`

With the following definitions:
- Impact Bid Price: Average execution price for a market sell of the impact notional value
- Impact Ask Price: Average execution price for a market buy of the impact notional value
- Impact Notional Amount: USD 500 / Market initial margin. This is set in the liquidity tier configuration for that market and can be changed by governance. The BTC-USD market, for example, has an impact notional of USD 10,000.

The premium formula simplifies to the following:

`If Impact Bid Price <= Index Price <= Impact Ask Price, the premium is 0`    

`If Index Price < Impact Bid Price: Premium = (Impact Bid Price - Index Price) / Index Price =  Impact Bid Price / Index Price - 1`

`If Impact Ask Price < Index Price: Premium = (Impact Ask Price - Index Price) / Index Price = Impact Ask Price / Index Price - 1`

### Interest Rate Calculation
The second component of the funding rate is the fixed interest rate, which accounts for the cost of capital involved in executing carry trades. These trades, typically performed by sophisticated traders, help realign the price of the perpetual with the underlying asset when they diverge. Providing sufficient incentives for these trades is crucial; without them, the perpetual price may not track the spot price closely. Carry trades often require borrowing funds from other platforms, and the interest rate component subsidizes this borrowing cost. Intuitively, when the perpetual price matches the underlying price, running a carry trade should break even. However, the moment prices diverge, executing a carry trade aligned with the funding rate becomes profitable, incentivizing traders to restore price equilibrium. Given that the interest rate is designed to subsidize borrowing, it typically ranges between 8-12%. As a result, even when the perpetual price matches the underlying price, the funding rate remains non-zero, equal to the interest rate.

The interest rate is set for each market according to the following formula:

`Interest Rate = (Interest Quote Index - Interest Base Index) / Funding Interval`

Where:
- Interest Quote Index: The interest rate for borrowing the quote currency (e.g., USDC in a BTC-USD market)
- Interest Base Index: The interest rate for borrowing the base currency (e.g., BTC in a BTC-USD market)
- Funding Interval: 24 hours divided by the funding frequency. In our case, this is 3 (as we calculate for 8-hour periods, while subdividing into hourly settlements)

### Funding Rate Calculation

Once we have calculated the premium and the interest rate, the funding rate is calculated as follows:

`Funding Rate = (Premium Component + Interest Rate Component) * Time Since Last Funding / 8 hours` 

Since the `Time Since Last Funding` will typically be roughly 1 hour, the final calculation for the funding rate looks as follows:

`Funding Rate = (Premium Component + Interest Rate Component) / 8`

In order to protect traders, there is a maximum cap on the 8-hour funding rate. The particular cap depends on the market and is calculated as follows:

`8-hour Funding Rate Cap = 600% * (Initial Margin - Maintenance Margin Requirement)`

For example, if the Initial Margin is 6% and the Maintenance Margin Requirement is 3%, then the 8-hour Funding Rate Cap is 18%.
