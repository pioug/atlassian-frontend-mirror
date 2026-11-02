# Feature Gate Fetcher

Provides fetch logic to get client sdk keys and feature gate values from the feature-flag-service.
To be used in Provider implementations used with @atlaskit/feature-gate-js-client

## Usage

To fetch flag values from both Statsig and the Feature Flag Platform (FFP)

```typescript
import Fetcher, {
	getEvalFlagsStatus,
	toFrontendExperimentsResult,
} from '@atlaskit/feature-gate-fetcher/Fetcher';

const evalFlagsResponse = await Fetcher.fetchEvalFlags(
	// Version of the feature gate js client
	'clientVersion',
	// Fetch options
	{
		environment: FeatureGateEnvironment.Development,
		targetApp: 'targetApp',
		perimeter: PerimeterType.COMMERCIAL,
		apiKey: 'apiKey',
	},
	// Identifiers
	{ atlassianAccountId: 'abc' },
	// Optional: custom attributes
	{},
);

// `{ statsig?, ffp?, status }`: the service decides which platform serves each flag, and reports
// each platform's health as OK, DISABLED or UNAVAILABLE. When no platform is OK and one is
// UNAVAILABLE, there are no values, so fetchEvalFlags rejects as for a 5xx (not a ResponseError).
// Convert it into the result a Provider returns to @atlaskit/feature-gate-js-client. Only the
// sections of OK platforms are used, and the result's `status` reports the health:
const result = toFrontendExperimentsResult(evalFlagsResponse, customAttributes);

// Or read the health directly:
const { statsig, ffp } = getEvalFlagsStatus(evalFlagsResponse);
```

To fetch Statsig experiment values only. These do not include flags served by FFP, so prefer
`fetchEvalFlags`.

```typescript
import Fetcher from '@atlaskit/feature-gate-fetcher';

const experimentValuesResponse = Fetcher.fetchExperimentValues(
	// Version of the feature gate js client
	'clientVesion',
	// Fetch options
	{
		environment: FeatureGateEnvironment.development,
		targetApp: 'targetApp',
		perimeter: PerimeterType.COMMERCIAL,
		apiKey: 'apiKey',
		// Optional, defaults to false: fetch from /api/v1/evalFlags and return only its Statsig section
		includeFfpFlags: false,
	},
	// Identifiers
	identifiers: {
		atlassianAccountId: 'abc'
	},
	// Optional: custom attributes
	customAttributes: {},
);
```

To fettch client sdk key


```typescript
import Fetcher from '@atlaskit/feature-gate-fetcher';

const clientSdkKey = Fetcher.fetchClientSdkKey(
	// Version of the feature gate js client
	'clientVesion',
	// Fetch options
	{
		environment: FeatureGateEnvironment.development,
		targetApp: 'targetApp',
		perimeter: PerimeterType.COMMERCIAL,
		apiKey: 'apiKey'
	},
	// Identifiers
	identifiers: {
		atlassianAccountId: 'abc'
	},
	// Optional: custom attributes
	customAttributes: {},
);
```

Detailed docs and example usage can be found
[here](https://atlaskit.atlassian.com/packages/measurement/feature-gate-fetcher).
