# QuantClaw Product Notes

QuantClaw is a crypto trading assistant built on the OpenClaw local-first runtime. The inherited gateway, channel, skill, and extension system is infrastructure; the product is focused trading research, paper execution, Telegram workflows, and guarded live-trading alpha.

## Repo Surface

- Package name: `quantclaw`
- Primary command: `quantclaw`
- GitHub repository: `adinarayanan2003/quantclaw`
- Trading skill: `skills/quantclaw-trading`

## Product Direction

QuantClaw should prioritize:

- crypto research workflows
- watchlists and portfolio context
- paper trading as the default execution mode
- Telegram as the first messaging channel
- hidden Binance live-trading alpha through CCXT, disabled unless explicitly configured
- clean public-facing repo docs and package metadata

## Live Trading Guardrails

Live trading must remain disabled by default. Any live-trading implementation should require:

- `QUANTCLAW_LIVE_TRADING=1`
- Binance API credentials
- configured max order notional
- audit logging for attempted, completed, and failed orders

No code path should place a live order from a normal research or paper-trading command.

## Cleanup Rule

Remove generic assistant marketing from public docs. Keep inherited internal names only when changing them would risk breaking runtime behavior.
