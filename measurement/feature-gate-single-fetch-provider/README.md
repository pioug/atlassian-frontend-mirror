# SingleFetchProvider

Provider which does a single fetch get values from feature-flag-service on page loads and when a user is updated. To be used with the
@atlaskit/feature-gate-js-client

## Usage

Used when initializing the feature-gate-js-client using `initializeWithProvider`.

```javascript
import FeatureGates, { FeatureGateEnvironment, FeatureGateProducts } from '@atlaskit/feature-gate-js-client';
import SingleFetchProvider from '@atlaskit/feature-gate-single-fetch-provider';

try {
  await FeatureGates.initializeWithProvider(
    clientOptions,
	new SingleFetchProvider({
		// This is an fx3 api key used to fetch the feature flag values.
        // Supported keys found at go/fx3/resources/api-keys
		apiKey: 'client-test',
		// [Optional] Default is 2000ms
		// This is the fetch timeout used for requests to feature-flag-service to get values to bootstrap the client.
		// The higher this value the longer your application will need to wait to render if you block on client initialization
		// Too low and your application will be more likely to fallback on default values
		fetchTimeoutMs: 1000,
		// [Optional] Default is false
		// This is a boolean to indicate whether to use the `gateway/api` url for the request to feature flag service.
		// Note that this option takes precendence over the environment and perimeter options in building the url.
		// To be used for applications with strict cross-origin policies, as it will keep all requests to the same origin.
		useGatewayUrl: true,
	})
    identifiers,
    customAttributes
  );
} catch (err) {
  console.error("Failed to initialize FeatureGates client.", err);
}
```

Detailed docs and example usage can be found
[here](https://atlaskit.atlassian.com/packages/measurement/feature-gate-single-fetch-provider).
