# @atlaskit/flag-client

## 1.0.3

### Patch Changes

- [`e66b9f131117d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e66b9f131117d) -
  Bound exposure memory and `localStorage` use while delivery keeps failing. **In memory:** from the
  first retryable delivery failure until a delivery gets any other outcome, the client keeps only
  its 1,000 most recent queued exposures, before as well as after its circuit breaker opens. **In
  `localStorage`:** exposures saved when the page is hidden now share a budget of 131,072 UTF-16
  code units (256 KiB) with every other client on the origin, keys included, and each client saves
  only its most recent exposures that fit; the others stay in memory. The separate limit of 1,000
  exposures saved per client is removed, so the budget alone decides how many are saved.
- [`e66b9f131117d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e66b9f131117d) -
  Send exposures saved to `localStorage` by an earlier page as soon as a new client takes them,
  rather than after `flushIntervalMs`. A page whose deliveries fail, for example because a content
  blocker rejects every request, now finds out moments after it loads. Exposures queued afterwards,
  and a client that takes nothing, keep the usual batching.
- [`e66b9f131117d`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/e66b9f131117d) -
  Limit `localStorage` use on origins that never deliver exposures, such as pages where a content
  blocker rejects every request. After a successful delivery, the client records the time under
  `@atlaskit/flag-client:last-delivery`, at most once an hour. While deliveries are failing and the
  origin has no recorded successful delivery in the last 7 days, exposures saved when the page is
  hidden share a budget of 4,096 UTF-16 code units (8 KiB) instead of 131,072, so a permanently
  blocked origin keeps almost nothing in storage while a temporary outage keeps the full budget.

## 1.0.2

### Patch Changes

- [`06e7927d5c0f1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/06e7927d5c0f1) -
  Add a circuit breaker to exposure delivery, so failures that last a long time no longer cause
  constant retries or lost exposures. After 3 consecutive retryable failures, the client stops
  sending and keeps queueing its exposures, saving them to `localStorage` when the page is hidden as
  before. It then sends one batch about every 60 seconds until the endpoint answers, and flushes the
  queue. Retryable failures are network errors, requests not settled within 30 seconds, HTTP `429`,
  and now every `5xx` status, which used to drop the batch. Retryable failures no longer drop an
  exposure after 10 attempts; while the breaker is open, the client keeps the 1,000 most recent
  exposures in memory. Exposures saved to `localStorage` by an earlier page are now delivered to
  this client's configured `endpoint`, rather than to the endpoint recorded with them.

## 1.0.1

### Patch Changes

- [`a2ea8ea9ef3c1`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a2ea8ea9ef3c1) -
  Exposure logging now loads in a separate async chunk instead of shipping in this package's main
  bundle, roughly halving what it costs up front: about 28 kB to 15 kB minified, and 8.8 kB to 4.7
  kB gzipped. Flag reads and flag values are unchanged, and exposures are still recorded, including
  those fired before the chunk arrives. The chunk is requested as soon as the client is constructed,
  so it downloads alongside everything else; exposures held in memory are only lost if the page
  closes in the short window before it lands, where previously they would have been sent on the next
  page load. No code changes are needed, though bundlers will emit one extra async chunk for this
  package.

## 1.0.0

### Major Changes

- [`a1bc133c66045`](https://bitbucket.org/atlassian/atlassian-frontend-monorepo/commits/a1bc133c66045) -
  Add @atlaskit/flag-client, a browser-safe client for reading server-evaluated Feature Flag
  Platform flags from a bulk evaluation payload, with batched OTLP exposure telemetry. Exposes
  FlagClient via @atlaskit/flag-client/client and public types via @atlaskit/flag-client/types.
