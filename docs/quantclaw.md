# QuantClaw Fork Notes

QuantClaw is a crypto-focused fork of OpenClaw. The fork keeps OpenClaw's local-first assistant, gateway, channel, skill, and extension architecture, while adding a trading-oriented product direction.

## Current Fork Surface

- Package name: `quantclaw`
- Primary command: `quantclaw`
- Compatibility command: `openclaw`
- GitHub repository: `adinarayanan2003/quantclaw`
- Trading skill: `skills/quantclaw-trading`

## V1 Product Direction

QuantClaw should prioritize:

- crypto research workflows
- watchlists and portfolio context
- paper trading as the default execution mode
- Telegram as the first messaging channel
- hidden Binance live-trading alpha through CCXT, disabled unless explicitly configured

## Live Trading Guardrails

Live trading must remain disabled by default. Any live-trading implementation should require:

- `QUANTCLAW_LIVE_TRADING=1`
- Binance API credentials
- configured max order notional
- audit logging for attempted, completed, and failed orders

No code path should place a live order from a normal research or paper-trading command.
