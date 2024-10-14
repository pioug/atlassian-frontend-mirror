# Feature Gate Fetcher

Provides fetch logic to get client sdk keys and feature gate values from the feature-flag-service.
To be used in Provider implementations used with @atlaskit/feature-gate-js-client

## Usage

To fetch experiment values

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
