# Platform killswitch

Read named operational killswitches from the Statsig `killswitch` dynamic config.
Its `value` parameter is an array of names. Matching is case-insensitive and reads
never fire experiment exposure events. Missing or invalid values disable all
killswitches.

```ts
import { killswitch } from '@atlaskit/platform-killswitch/killswitch';

if (killswitch('relay-get-queries')) {
	// Fall back to POST requests.
}
```

The host app owns initialization of `@atlaskit/feature-gate-js-client` and delivery
of the `killswitch` config. This package does not initialize Jira or use Jira SSR
globals. Before SDK initialization completes, the helper returns `false` without caching.
It reads and caches the config on the first initialized call, then uses that
snapshot for the lifetime of the module. Config updates require a page reload.
