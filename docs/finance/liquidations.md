---
sidebar_position: 4
description: What are liquidations?
---

# Liquidations

## Introductory
Liquidations in perpetuals occur when a trader's account becomes too risky for the system. Imagine borrowing money to bet on the price of something, like Bitcoin, and the market moves against you so much that your losses are close to exceeding the value of your account. To protect the system and other traders, the platform steps in to "close" your position before the losses grow uncontrollably. This process is called liquidation.

It's important to note that the price at which a liquidation is triggered is known to the trader when they enter the perpetual, so it should never come as a surprise.

In essence, liquidations act as a safety net for the trading platform, ensuring that no single bad trade can jeopardize the system's stability.

## Advanced
Liquidation is the process of forcefully closing a trader's position on the orderbook. This occurs when the trader's account balance, including collateral and unrealized profits or losses, falls below the maintenance margin requirement. During liquidation, the system matches the trader’s position with counter-orders on the market, effectively selling or buying the position to bring the account back into compliance or close it entirely. If liquidity is insufficient or the clearing price results in a negative balance, additional mechanisms, such as insurance funds or deleveraging, are employed to manage risks.

### Maintenance Margin and Liquidation Conditions
A perpetual maintenance margin rate is the minimum collateral a trader must maintain to keep a position open. This rate, typically between 1-10% of the position size, varies depending on platform-specific risk parameters. An account is deemed liquidatable when its value (including profits and losses) falls below the maintenance margin requirement.

Each block, the system identifies all accounts with liquidatable positions. However, since the number of transactions per block is capped, not all positions can be liquidated at once. To address this, the system employs a priority mechanism to determine which accounts are liquidated first based on their risk level.

#### Liquidation Priority Metric
The priority for liquidation is calculated using the following metric:

`Priority=account_health / weighted_size`

Where:

`Account Health=total_net_collateral / maintenance_margin`

`Weighted Size=Sum( abs(position_size_i) * danger_index_i )`

Here, i refers to each perpetual contract the account holds, and the Danger Index is a market-specific parameter representing the relative risk of that contract. Accounts are sorted by this metric, ensuring that those at the highest risk are prioritized for liquidation.

### Liquidation Process
Once an account is selected for liquidation, the system identifies the specific position (perpetual contract) that, when liquidated, maximally improves the account’s health. If liquidating a single position doesn’t restore the account above the maintenance margin, the account is re-evaluated and re-inserted into the liquidation queue with an updated priority for further processing.

### Safety Mechanisms: Insurance Fund and Deleveraging
To maintain system stability during periods of low market liquidity:
- Liquidation Prioritization: Liquidations are prioritized over standard orderbook transactions to ensure unhealthy accounts are addressed promptly.
Insurance Fund: If liquidation results in a negative balance due to low liquidity, the Klyra chain’s insurance fund covers the shortfall. The insurance fund receives a portion of Klyra’s fees and ensures the solvency of the exchange in case of failures. The insurance fund is permissionless and run programmed into the chain: this is not run by the Klyra team or any other central entity.
In rare cases where liquidation cannot be completed successfully, a deleveraging mechanism is triggered. This mechanism forcefully closes the unhealthy account by offsetting its positions against randomly selected accounts with opposing positions. Deleveraging is a last resort and is designed to be an extremely rare occurrence. If triggered, the system halts the opening of new positions to protect the ecosystem and traders.


### Liquidation Price
When liquidating an account’s perp position, a minimum price must be determined to place the order on the orderbook. This is the worst price at which the order can be executed. To determine the liquidation price, Klyra uses the most aggressive price between the bankruptcy price and the fillable price. The bankruptcy price is the price at which if the liquidation is matched will result in an account balance of zero (i.e all collateral is wiped out). The fillable price varies depending on the health of the account; the worse the health, the higher the delta between the oracle price and the fillable price. This means that when the account is barely liquidatable Klyra will use the bankruptcy price to maximize the chance that the account gets liquidated (this is a safety mechanism). When the account is very close to bankruptcy Klyra will use the fillable price to allow for more potential orders that can match with the insurance fund covering. This is designed to maximize the likelihood of a successful liquidation. Below is the formula used to calculate each of these respective prices.

#### Bankruptcy Price
`bankruptcy price = (-DNNV - (TNC * (abs(DMMR) / TMMR))) / PS`

- DNNV (delta position net notional value) is PNNVAD - PNNV

- PNNV is the position net notional value

- PNNVAD is the position net notional value after delta. 

- Net notional value refers to the value of the position in the quote currency (typically USD). 

- TNC: total net collateral

- DMMR (delta maintenance margin requirement) =  PMMRAD - PMMR 
where PMMRAD is the position margin requirement after delta.

- TMMR: total maintenance margin requirement of the current open position 

- PS: position size

- Delta: refers to the change in position size due to the liquidation order being matched

#### Fillable Price
`fillable price = (PNNV - ABR * SMMR * PMMR) / PS`

- PNNV is the position net notional value

- ABR (adjusted bankruptcy rate) is BA * (1 - (TNC / TMMR))

- BA: bankruptcy adjustment in parts per million (this is a constant set in the configuration of the chain that can be changed by a governance vote)

- SMMR: spread to maintenance margin ratio (this is a constant set in the configuration of the chain that can be changed by a governance vote)

- PMMR: position maintenance margin requirement
