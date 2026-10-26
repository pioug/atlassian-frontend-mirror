# @atlaskit/flag-client

Browser-safe JavaScript client for reading server-evaluated feature flags from a
`BulkEvaluationPayload`.

The client does not fetch, poll, subscribe, or evaluate flag rules locally. A caller, normally the
`@atlaskit/feature-gate-js-client` wrapper, obtains a payload (from the Feature Flag Service
`/evalFlags` response or a server-rendered bootstrap) and hands it to the client through a
synchronous provider.

This package is the FFP JavaScript client. It is maintained here, in the Atlassian Frontend
monorepo. Its behaviour is specified by the `client-js-*` capabilities under
[`openspec/specs/`](https://bitbucket.org/atlassian/feature-flag-platform/src/main/openspec/specs/)
in the `feature-flag-platform` repository.

## Install and import

```bash
yarn add @atlaskit/flag-client
```

```ts
import { FlagClient } from '@atlaskit/flag-client/client';
import type { BulkEvaluationPayload, FlagUser } from '@atlaskit/flag-client/types';
```

## Payload shape

`BulkEvaluationPayload`, which providers return, is the union of the payload wire formats this
client supports, discriminated by `vs`. It currently has one member, `BulkEvaluationPayloadV1`. A
future schema version may have an entirely different shape and will always carry its `vs`.

A `BulkEvaluationPayloadV1` is an object with:

- `vs` (optional): the payload schema version. The only supported version is `"1"`, and an absent
  `vs` is treated as `"1"`. A payload without `vs` and an otherwise identical payload with `vs: "1"`
  produce identical flag values and details metadata. Any other value, including `null` or the
  number `1`, fails initialization or replacement with `invalid_schema_version` before the rest of
  the payload is validated.
- `flags` (required): a `BulkEvaluationResult`, which maps each flag key to a `FlagResult`. Its
  shape matches the `flags` member of the Feature Flag Service `ffp` payload. It may be empty.
- `requestContext` (required): the identifiers and attributes the payload was evaluated for. It must
  be well formed, but the client does not use it for reads or details. A payload without it fails
  with `invalid_payload_shape`. Its `attributes` is optional and an absent `attributes` is retained
  as `{}`; a `null` `attributes` is rejected with `invalid_payload_shape`.
- `clientVersion` (optional): the version of the flag data, `{ token, updatedAt? }`, matching the
  Feature Flag Service `FfpBootstrapPayload.ClientVersion`. When present, `token` must be a
  non-empty string and `updatedAt` a string. The client keeps it with the payload, swaps it on
  `replace`, and does not use it for reads or details.

A `null` `requestContext` or `clientVersion` is invalid. Other payload members, such as `status` or
`targetApp`, are ignored, so an `ffp` object can be passed as-is. Unknown members inside flag
results and their metadata are also ignored.

This input intentionally differs from the server SDK `BulkEvaluationPayload` described in
[`sdks/README.md`](https://bitbucket.org/atlassian/feature-flag-platform/src/main/sdks/README.md):
it has no payload-level `status`.

Each flag result's metadata may also carry `holdoutAllocation`, `segments`, `targetApps`,
`flagVersion`, and `errorMessage`. When present they must be an object or `null`, an array of
objects, an array of strings, a string, and a string respectively. A `holdoutAllocations` list from
an older producer is ignored.

## Initialize

Construct one client per target app and environment, then initialize it. Initialization is
synchronous, one-time per client instance, and never throws.

```ts
const client = new FlagClient({
	targetApp: 'jira-frontend',
	environmentType: 'prod', // 'dev' | 'local' | 'staging' | 'prod'
	serviceVersion: appVersion, // optional
});
const user: FlagUser = {
	identifiers: { atlassianAccountId: accountId },
	attributes: { plan: 'premium' }, // optional
};

const init = client.initialize(() => payload, user);

if (!init.initialized) {
	// Reads return safe defaults. The SDK logs the failure reason and a troubleshooting tip.
}
```

- The constructor options are fixed for the life of the instance. `targetApp` and `environmentType`
  are required and `serviceVersion` is optional. The client copies them without validating them at
  runtime, never throws during construction, and does not use them for reads. They identify the
  client in exposure telemetry.
- The provider is invoked only during `initialize` or `replace`. The client keeps an immutable
  snapshot of the payload it returns.
- Failure reasons are `already_initialized`, `provider_threw`, `provider_returned_no_payload`,
  `invalid_schema_version`, `invalid_payload_shape`, and `payload_capture_failed`. A failed
  initialization, other than `already_initialized`, can be retried.

### Users

The user is normalized into a frozen copy when it is stored:

- Identifier values that are not strings are dropped.
- Attribute values that are not strings, booleans, or finite numbers are dropped.
- A user, `identifiers`, or `attributes` member that is not an object is treated as empty. Omitting
  `attributes` is equivalent to `{}`.

Normalization never fails initialization or replacement, and an empty identifier map is valid. When
anything is dropped, the SDK logs one `console.warn(...)` per call that names the dropped keys but
never their values.

The client keeps the normalized user from every initialization attempt other than
`already_initialized`, including one that fails, so exposure telemetry can attribute reads made
before initialization succeeds.

## Replace the payload and user

Use `replace` when the user changes. It swaps the payload and user together; the constructor options
do not change.

```ts
const outcome = client.replace(() => nextPayload, nextUser);

if (!outcome.replaced) {
	// The previous payload and user are still served.
}
```

`replace` fails with `not_initialized`, without invoking the provider, until `initialize` has
succeeded. Its other failure reasons match initialization's provider and payload reasons. Any failed
replacement keeps the previous payload and user, and the SDK logs the reason and a tip.

## Read values and details

Typed value reads return the initialized flag value when the payload can serve the requested flag
and type. Otherwise, they return the caller-provided safe default.

```ts
const enabled = client.getBooleanValue('admin-toolbar.enabled', false);
const label = client.getStringValue('button.label', 'Continue');
const maxResults = client.getNumberValue('search.max-results', 25);
const config = client.getObjectValue('ui.config', { density: 'comfortable' });
```

Details reads return the same selected value plus metadata for the requested flag.

```ts
const details = client.getBooleanDetails('admin-toolbar.enabled', false);

console.log(details.value);
console.log(details.metadata.matchReason);
console.log(details.metadata.identifierValue); // from the current user
console.log(details.metadata.holdoutAllocation);
```

`identifierValue` is looked up in the current user's identifiers using the result's
`identifierType`, never in the payload's `requestContext`. `holdoutAllocation` is the result's
allocation, or `null` when absent, and `segments` is the result's list, or an empty array when
absent. `targetApps`, `flagVersion`, and `errorMessage` are retained internally and are not part of
details metadata.

## Safe defaults and code defaults

The client returns the safe default when it is uninitialized, the flag is absent, the requested read
type does not match the flag result, the runtime value shape is unusable, or the result has
`useCodeDefault = true`.

For `useCodeDefault = true`, details reads still preserve server metadata from the payload. Other
fallback cases use client-generated metadata: `not_initialized`, `flag_not_found`, or
`type_mismatch`.

## Object and array values

Object and array values selected from initialized payload state come from the client's immutable
payload snapshot. Mutation attempts against those returned initialized values do not change later
reads or details metadata. Clone a returned object or array before mutating it in application code.

Safe default values are returned as provided by the caller.

## Exposure telemetry

In a browser, every typed value or details read records one exposure: an OpenTelemetry log record in
the shared exposure schema (`sdks/design/otel-exposure-event-schema.md` in the feature-flag-platform
repository). The client batches exposures and posts them as OTLP/JSON to Flag Telemetry.

Exposure logging is on by default only when a global `window` exists at construction. In Node and
SSR it is off unless `enabled: true` is passed. DOM test environments such as jsdom and happy-dom
define `window`, so pass `enabled: false` in tests that must not post exposures. Configure it with
the `exposureLogging` constructor option:

```ts
const client = new FlagClient({
	targetApp: 'jira-frontend',
	environmentType: 'prod',
	exposureLogging: {
		enabled: true, // default: whether a global `window` exists
		endpoint: 'https://xp.atlassian.com/ft/v1/logs', // default; or a same-origin path
		batchSize: 100, // default: exposures that trigger an immediate delivery
		flushIntervalMs: 10_000, // default: how long a queued exposure waits
	},
});
```

An option that fails its type, such as `batchSize: 0`, `endpoint: 'relative/path'`, or an `endpoint`
URL with a username or password, is ignored: its default applies and the client writes one
`console.warn` naming the option, never its value. Construction never throws. A disabled client does
not check `endpoint`, `batchSize`, or `flushIntervalMs` at all, so passing one configuration to both
browser and SSR clients is quiet.

### What an exposure carries

- `service.name` and `feature_flag.set.id` come from `targetApp`. `deployment.environment_type` and
  `deployment.environment.name` come from `environmentType`, and `service.version` from
  `serviceVersion`.
- The Instrumentation Scope name and `atl.feature_flag.sdk.type` are `@atlaskit/flag-client`, and the
  scope version is this package's version.
- Identifiers and attributes come from the held payload's `requestContext`. While the client holds
  no payload, they come from the current user, which after a failed `initialize` is the user passed
  to it. Details `identifierValue` always comes from the current user.
- `atl.feature_flag.result.source` is `bootstrap` when the read was made while the client held an
  initialized payload, including for `flag_not_found` and `type_mismatch`, and `fallback` for a read
  made before a successful `initialize`, even when `logExposure` replays it later.
- Error reasons (`not_initialized`, `flag_not_found`, `type_mismatch`, `general_error`, and
  `invalid_context`) carry no variant or rule, and their error message starts with `FFP evaluation
  failed: <reason>`. `general_error` and `invalid_context` use the payload's `errorMessage` instead
  when it is nonempty. A `not_initialized` message ends with the cause, such as `(no initialize
  attempt completed)` or the most recent failure reason.
- `type_mismatch` keeps the payload flag's version and target apps.
- A holdout allocation becomes the `atl.feature_flag.holdout_allocation.*` attributes only when its
  `holdoutKey`, `identifierType`, and `allocationReason` are strings, with `holdout_rule_id` only
  for a string `holdoutRuleId`. Otherwise all four are omitted.

### Suppress and log manually

Pass `{ disableExposureLogging: true }` to any read to skip its automatic exposure. Log one later,
for example when the user actually sees the feature, with `logExposure`:

```ts
const details = client.getBooleanDetails('new-nav.enabled', false, {
	disableExposureLogging: true,
});
// ...later, when the navigation is rendered:
client.logExposure(details);
```

For details this client returned, including shallow copies, `logExposure` records the exposure the
read would have produced, marked manual, even after a later `initialize` or `replace`. Details the
client did not return, such as ones rebuilt from JSON, use the client state current at the call. It
never throws and does nothing when exposure logging is disabled.

### Deduplication, delivery, and persistence

- An exposure with the same flag key, variation, rule, match reason, and identifiers as one queued
  in the last ten minutes is discarded. Manual and automatic exposures share these windows. A
  successful `replace` ends them all.
- One request is in flight at a time, sent with `credentials: 'omit'`. `429`, `503`, and network
  errors are retried with exponential backoff from 1 second to 30 seconds. An exposure is dropped
  after 10 failed attempts. Any other non-`2xx` status drops the batch.
- When the page is hidden, undelivered exposures are saved to `localStorage` under keys starting
  `@atlaskit/flag-client:exposures:`, and so is each exposure queued while it stays hidden. The
  next client constructed on the same origin delivers them. Storage errors never throw.

### Same-origin and cross-origin delivery

`endpoint` also accepts a path that begins with a single `/`. The client resolves it once at
construction against `window.location.origin`, so a product with a same-origin route to Flag
Telemetry avoids CORS entirely, as GASv3 does:

```ts
// Delivers to https://<product host>/gateway/api/ft/v1/logs
exposureLogging: { endpoint: '/gateway/api/ft/v1/logs' }
```

The path above is illustrative; use the route your product actually serves. A path is ignored with a
warning when the client is enabled without a `window`, the origin is opaque, the path starts with
`//` or `/\`, or it resolves to another origin.

Without a path, exposures are posted cross-origin to `https://xp.atlassian.com/ft/v1/logs` as
`application/json`, which requires a CORS preflight. Delivery from a product page then depends on
that route answering the preflight.

## Development

Run from the `platform/` directory:

```bash
afm test unit packages/measurement/flag-client
afm ts check --project ./packages/measurement/flag-client/tsconfig.app.json
afm lint eslint packages/measurement/flag-client
```

The shared test vectors in `src/__tests__/__fixtures__/` are vendored from the feature-flag-platform
repository: `bulk-evaluation-fixtures.json` from `sdks/evaluation-test-vectors`, and
`exposure-test-vectors/` (JSON files only) from `sdks/exposure-test-vectors`. Keep them in sync when
the shared fixtures change.
