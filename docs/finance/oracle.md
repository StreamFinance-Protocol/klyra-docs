---
sidebar_position: 7
description: Learn about Klyra's price oracle
---

# Oracle

## Introductory
Klyra updates market prices every second by combining data from validators to ensure accuracy and fairness. Each validator gathers prices from multiple sources, calculates a reliable price by taking the median, and shares it with the group. The final price is determined by taking the median of all the validators' suggestions, ensuring no single source or validator can overly influence the outcome. This process filters out bad data and provides a fast, secure, and reliable way to keep prices updated for the market.

## Advanced
Price updates on Klyra are an aggregation of validator proposed prices on every block (1 second on average). Every validator perpetually runs a sidecar which queries a variety of price sources and determines a single price for each market by taking a median of these queried prices. These single prices are kept in the sidecar’s cache to be used by the validators when it’s needed. Upon every block, each validator will send their proposed price to all other validators and the validator building a block (the proposer) will take another aggregated median of all these prices for each market to determine the final price that will be written to state (the network price). The price that is proposed by each validator isn’t solely the price fetched from the sidecar but a median of three prices: the clob mid price, the funding weighted oracle price, and an historical smoothed price. This system is fault tolerant to oracle attacks in two ways. First, every validator takes a local median of prices to avoid faulty data from external prices feeds. Second, the final price written to state is a median of all validator prices which means consensus is reached on the final price. Below is a further explanation of all pieces that make up the oracle

### Oracle Price Median
For the sidecar to calculate the oracle price, it routinely queries a variety of external data pricefeeds. The external feeds are usually around 5-10 different exchanges like Binance, Kraken, Coinbase, etc. We query multiple exchanges to prevent the oracle failing if a single exchange goes down. The sidecar then aggregates these prices and stores the result as the oracle price. For example if Binance responds with BTC at \$65,100, Kraken at \$65,150, and Coinbase at \$65,050 then the final price stored in the sidecar is 1 BTC = \$65,100. The sidecar is run independently by every validator and is encouraged to use a varied set of pricefeeds to increase decentralization.

### Proposed Price Median
When it comes time for the validator to share their local view of prices they don’t just send the price stored in the sidecar to all other validators. Instead they take a median of three prices, designed to avoid faulty prices received from external exchanges. These three prices are the orderbook (clob) mid price, the funding weighted oracle price (oracle price = sidecar price), and a historical smoothed price. It’s important to note that this median is taken for every single market, so that each validator proposes a price for each individual market. Below is the exact calculation of each of these prices:

#### Clob Mid Price:
`Best Bid + ( (Best Ask - Best Bid) / 2)`

#### Funding Weighted Oracle Price:
`Oracle Price * (1 + funding price)`

#### Historical Smoothed Price:
Historical smoothed prices are calculated using [exponential smoothing](https://en.wikipedia.org/wiki/Exponential_smoothing) of prices.

### Network Price Median
The network price is the final price used for the financial logic of Klyra. It is taken from all the individual prices every single validator proposed per market. Now, the validator building the block will take the prices reported by each validator for each market and take a global median of these prices. The final price is what is actually written to state as a price update for each specific market. The price has the full decentralization properties of the Klyra chain since it is aggregated each block from validator proposed prices which are signed by the validators. Furthermore, for a price to be changed, we require at least 2/3 of the validators to suggest a new price from which we take a median.
