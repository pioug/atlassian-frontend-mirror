# @atlaskit/flag-client

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
