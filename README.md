# QuantClaw

QuantClaw is a crypto trading assistant built on the OpenClaw local-first agent stack. The goal is a focused assistant for market research, watchlists, paper trading, Telegram workflows, and a tightly guarded live-trading alpha.

QuantClaw is not a generic personal-assistant distribution. The inherited OpenClaw gateway, channel, skill, and extension system is the runtime substrate; the product direction is trading.

## Goals

- Research crypto markets with current price, catalyst, risk, and thesis summaries.
- Maintain watchlists and portfolio context for repeat analysis.
- Make paper trading the default execution mode.
- Support Telegram as the first messaging surface for trading workflows.
- Keep live trading disabled unless explicitly configured.
- Preserve auditability for every live-trading attempt, success, and failure.

## Non-Goals

- No default live order placement.
- No promise of returns or investment advice.
- No broad consumer-assistant positioning in the repo docs.
- No upstream OpenClaw marketing, sponsor tables, or unrelated launch copy.

## Status

This repo is currently a real OpenClaw-derived fork with the first QuantClaw cleanup pass applied:

- package name: `quantclaw`
- primary command: `quantclaw`
- control UI package: `quantclaw-control-ui`
- trading skill: `skills/quantclaw-trading`
- fork notes: `docs/quantclaw.md`

The underlying runtime still contains some inherited OpenClaw internals. Those should be renamed gradually only where the rename is safe and tested.

## Install

Use the pinned package manager from `package.json`.

```sh
corepack pnpm install
```

Build the source checkout before running the CLI:

```sh
corepack pnpm build
```

The source checkout expects built files under `dist/`. Running the CLI before building will fail with a missing `dist/entry` message.

## CLI

```sh
node quantclaw.mjs --help
```

After global/package linking, the intended command is:

```sh
quantclaw
```

## Configuration

Start with:

```sh
cp .env.example .env
```

Some core runtime environment variables still use `OPENCLAW_*` names because the fork is currently preserving upstream compatibility. QuantClaw-specific trading controls use `QUANTCLAW_*`.

Trading alpha controls:

```sh
QUANTCLAW_LIVE_TRADING=1
QUANTCLAW_LIVE_EXCHANGE=binance
QUANTCLAW_MAX_ORDER_NOTIONAL=100
BINANCE_API_KEY=
BINANCE_API_SECRET=
```

Live trading must stay disabled by default. Any implementation work touching live execution must preserve explicit opt-in, max-notional checks, and audit logging.

## Telegram

Telegram is the first target messaging surface for QuantClaw trading workflows.

```sh
TELEGRAM_BOT_TOKEN=...
```

Target commands:

- `/price BTC`
- `/watchlist`
- `/paper buy BTC 100`
- `/paper sell BTC 0.01`
- `/portfolio`
- `/pnl`

## Development Direction

1. Keep the inherited runtime working.
2. Replace public-facing inherited branding with QuantClaw branding.
3. Add native market-data, watchlist, portfolio, and paper-trading tools.
4. Add Telegram command flows on top of those tools.
5. Add the Binance/CCXT live alpha only behind explicit configuration and audit logs.

## Safety

QuantClaw handles trading workflows. Treat all market data, generated analysis, and order proposals as fallible.

- Default to paper trading.
- Show assumptions clearly.
- Never claim guaranteed performance.
- Never place live orders from research commands.
- Keep exchange keys scoped and max order limits small.

## License

MIT. This fork inherits OpenClaw's MIT-licensed codebase.
