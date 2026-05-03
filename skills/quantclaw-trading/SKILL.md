# QuantClaw Trading

Use this skill when the user asks QuantClaw to research crypto assets, maintain a watchlist, discuss trade ideas, paper trade, backtest a simple thesis, or prepare a live-trading order.

## Operating Mode

- Treat crypto trading as high-risk. Never present analysis as guaranteed returns.
- Default to research and paper-trading workflows.
- For live-trading requests, require the runtime to be explicitly configured for live trading before preparing any executable order.
- Prefer concise outputs with prices, time horizon, thesis, invalidation, risk, and next action.

## Research Workflow

1. Identify the asset, quote currency, timeframe, and user intent.
2. Gather current market context from configured market-data tools.
3. Summarize:
   - current price and 24h change
   - trend and volatility context
   - relevant catalysts or risks
   - support/resistance only when backed by available data
4. Separate facts, assumptions, and opinionated trade thesis.

## Paper Trading Workflow

- Use paper trading unless the user explicitly requests live trading and live mode is enabled.
- For a paper buy, express order size in quote currency unless the user specifies base units.
- For a paper sell, express order size in base units unless the user specifies percent of position.
- Record every paper trade with symbol, side, size, estimated fill, fees, slippage, and timestamp.
- After execution, show updated cash, position, and portfolio PnL.

## Live Trading Alpha Policy

Live trading is an alpha feature. Before preparing an executable live order, verify:

- `QUANTCLAW_LIVE_TRADING=1`
- exchange is configured as Binance through CCXT
- API credentials are present
- max order notional is configured
- requested order notional is within the configured max

Do not bypass configured live-trading guards. If any guard is missing, convert the request into a paper trade or dry-run summary.

## Response Shape

For trade analysis, use:

```text
Asset:
Market:
Thesis:
Risk:
Invalidation:
Action:
```

For executed or simulated orders, use:

```text
Order:
Fill:
Fees/slippage:
Position:
PnL:
Audit:
```
