# FeatureGateJsClient

Atlassians wrapper for the Statsig js-lite client.

## Usage

`import FeatureGateJsClient from '@atlaskit/feature-gate-js-client';`

Detailed docs and example usage can be found
[here](https://atlaskit.atlassian.com/packages/measurement/feature-gate-js-client).

## What is this repository for?

The js-client covers frontend feature gate use cases. This client is modelled around bootstrapping
feature gate values from the backend and does not receive live updates.

## Client usage

### Installation

The client can be pulled from the Artifactory NPM repository.

```shell
yarn add @atlaskit/feature-gate-js-client
```

### Initialization

The client must be initialized before attempted usage or it will throw an error.

There are three ways to initialize your client:

#### 1. Default initialization mechanism

This will initialize the client by calling out to feature-flag-service
([fx3](https://go.atlassian.com/fx3)), and bootstrapping the client with the returned values. If the
client fails to initialize for any reason, including taking longer than 2 seconds to fetch the
values, default values will be used.

```typescript
import FeatureGates, {
	FeatureGateEnvironment,
	FeatureGateProducts,
	PerimeterType,
} from '@atlaskit/feature-gate-js-client';

try {
	await FeatureGates.initialize(
		{
			// This is an fx3 api key used to fetch the feature flag values.
			// Supported keys found at go/fx3/resources/api-keys
			apiKey: 'client-test',
			// This is the environment that you are operating in, targeting rules can target specific environments
			environment: FeatureGateEnvironment.Production,
			// This will be used to filter data from Statsig to only one target app.
			// View [doc](https://hello.atlassian.net/wiki/spaces/MEASURE/pages/2955970231/How-to+Use+TargetApps+in+Statsig)
			// for details on using targetApp.
			targetApp: 'jira_web',
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
			// [Optional] Must be one of the strings from the exported enum PerimeterType.
			// If provided, will build base url for the `feature-flag-service` based on environment and perimeter type, and
			// will disable all logging to Statsig in perimeters where it is prohibited..
			perimeter: PerimeterType.FEDRAMP_MODERATE,
		},
		{
			// These are expected identifiers, you must provide them if they are relevant to your product and will be added to exposures events
			analyticsAnonymousId: '<analyticsAnonymousId>',
			atlassianAccountId: '<aaid>',
			atlassianOrgId: '<orgid>',
			tenantId: '<tenantid>',
			transactionAccountId: '<transactionAccountId>',
			trelloUserId: '<trelloUserId>',
			trelloWorkspaceId: '<trelloWorkspaceId>',
		},
		{
			// These are additional custom attributes that can be used for targeting and will be added to exposure events
			exampleCustomAttribute: '<attributeValue>',
		},
	);
} catch (err) {
	console.error('Failed to initialize FeatureGates client.', err);
}
```

If your application has a log-in flow or other mechanism that makes it possible for the user to
change during a session, then you can use the `updateUser` method to apply this change. The
signature of this method is almost identical to `initialize`, except that it only requires options
that relate to the network call it will perform to fetch the new set of values.

**IMPORTANT**: Calling this method will completely re-initialize the client with a new set of flags.
You will need to re-render the entire page after this completes to ensure everything picks up the
new flag values. You should avoid using this frequently as it has implications on the user
experience.

```typescript
import FeatureGates, {
	FeatureGateEnvironment,
	FeatureGateProducts,
	PerimeterType,
} from '@atlaskit/feature-gate-js-client';

try {
	await FeatureGates.updateUser(
		{
			// This is an fx3 api key used to fetch the feature flag values.
			// Supported keys found at go/fx3/resources/api-keys
			apiKey: 'client-test',
			// This is the environment that you are operating in, targeting rules can target specific environments
			environment: FeatureGateEnvironment.Production,
			// [Optional] Default is 2000ms
			// This is the fetch timeout used for requests to feature-flag-service to get values to bootstrap the client.
			fetchTimeoutMs: 1000,
			// [Optional] Default is false
			// This is a boolean to indicate whether to use the `gateway/api` url for the request to feature flag service.
			// Note that this option takes precendence over the environment and perimeter options in building the url.
			// To be used for applications with strict cross-origin policies, as it will keep all requests to the same origin.
			useGatewayUrl: true,
			// [Optional] Default is COMMERCIAL. Must be one of the values from the exported enum PerimeterType.
			// If provided, will build base url for the `feature-flag-service` based on environment and perimeter type, and
			// will disable all logging to Statsig in perimeters where it is prohibited.
			perimeter: PerimeterType.FEDRAMP_MODERATE,
		},
		{
			// These are expected identifiers, you must provide them if they are relevant to your product and will be added to exposures events
			analyticsAnonymousId: '<analyticsAnonymousId>',
			atlassianAccountId: '<aaid>',
			atlassianOrgId: '<orgid>',
			tenantId: '<tenantid>',
			transactionAccountId: '<transactionAccountId>',
			trelloUserId: '<trelloUserId>',
			trelloWorkspaceId: '<trelloWorkspaceId>',
		},
		{
			// These are additional custom attributes that can be used for targeting and will be added to exposure events
			exampleCustomAttribute: '<attributeValue>',
		},
	);
} catch (err) {
	console.error('Failed to update the FeatureGates user.', err);
}
```

#### 2. Initializing from values

You must fetch the values yourself using one of our wrapper backend clients (Also found in this
repo) and providing them to this frontend client

```typescript
import FeatureGates, {
	FeatureGateEnvironment,
	FeatureGateProducts,
} from '@atlaskit/feature-gate-js-client';

try {
	await FeatureGates.initializeFromValues(
		{
			// [Optional] This should come directly from a backend or service from the Statsig.getClientInitializeResponse(user) call
			// Or supplied from the statsig UI
			// Should be provided if it is available. It is optional so initialisation can still occur if the request to fetch the key fails
			// If not provided, a default string will be used but exposure event data will not be sent back to Statsig
			sdkKey: 'client-test',
			// This is the environment that you are operating in, targeting rules can target specific environments
			environment: FeatureGateEnvironment.Production,
			// This will be used to filter config data relevant to the listed products
			products: [FeatureGateProducts.Jira],
		},
		{
			// These are expected identifiers, you must provide them if they are relevant to your product and will be added to exposures events
			analyticsAnonymousId: '<analyticsAnonymousId>',
			atlassianAccountId: '<aaid>',
			atlassianOrgId: '<orgid>',
			tenantId: '<tenantid>',
			transactionAccountId: '<transactionAccountId>',
			trelloUserId: '<trelloUserId>',
			trelloWorkspaceId: '<trelloWorkspaceId>',
		},
		{
			// These are additional custom attributes that will be added to exposure events
			exampleCustomAttribute: '<attributeValue>',
		},
		// This should come directly from a backend or service from the Statsig.getClientInitializeResponse(user) call
		initializeValues,
	);
} catch (err) {
	console.error('Failed to initialize FeatureGates client.', err);
}
```

If your application has a log-in flow or other mechanism that makes it possible for the user to
change during a session, then you can use the `updateUserWithValues` method to apply this change.
The signature of this method is almost identical to `initializeFromValues`, except that it does not
require any options.

**IMPORTANT**: Calling this method will completely re-initialize the client with a new set of flags.
You will need to re-render the entire page after this completes to ensure everything picks up the
new flag values. You should avoid using this frequently as it has implications on the user
experience.

```typescript
import FeatureGates, {
	FeatureGateEnvironment,
	FeatureGateProducts,
} from '@atlaskit/feature-gate-js-client';

try {
	await FeatureGates.updateWithValues(
		{
			// These are expected identifiers, you must provide them if they are relevant to your product and will be added to exposures events
			analyticsAnonymousId: '<analyticsAnonymousId>',
			atlassianAccountId: '<aaid>',
			atlassianOrgId: '<orgid>',
			tenantId: '<tenantid>',
			transactionAccountId: '<transactionAccountId>',
			trelloUserId: '<trelloUserId>',
			trelloWorkspaceId: '<trelloWorkspaceId>',
		},
		{
			// These are additional custom attributes that will be added to exposure events
			exampleCustomAttribute: '<attributeValue>',
		},
		// This should come directly from a backend or service from the Statsig.getClientInitializeResponse(user) call
		initializeValues,
	);
} catch (err) {
	console.error('Failed to update FeatureGates user.', err);
}
```

---

If there are any issues during initialization, then the client will be put in a mode which always
returns default values, and a rejected promise will be returned. You can catch this rejected promise
if you wish to record your own logs and metrics, or if you wish to stop your application from
loading with the defaults.

There is only once instance of the FeatureGates client, so only the first initialize call will start
the initialization. Any subsequent calls will return the existing Promise for the first
initialization, and the argument values will be ignored. In order to confirm whether the client has
started to initialize already you can call `FeatureGates.initializeCalled()`.

#### 3. Initializing using a Provider

This initialization is done using an implementation of the Provider in order to fetch the client sdk
key and experiment values needed.

Supported providers are:

- `@atlaskit/feature-gate-single-fetch-provider`
- `@atlaskit/feature-gate-polling-provider`

```typescript
import FeatureGates, {
	FeatureGateEnvironment,
	FeatureGateProducts,
	PerimeterType,
} from '@atlaskit/feature-gate-js-client';

try {
	await FeatureGates.initializeWithProvider(
		{
			// This is an fx3 api key used to fetch the feature flag values.
			// Supported keys found at go/fx3/resources/api-keys
			apiKey: 'client-test',
			// This is the environment that you are operating in, targeting rules can target specific environments
			environment: FeatureGateEnvironment.Production,
			// This will be used to filter data from Statsig to only one target app.
			// View [doc](https://hello.atlassian.net/wiki/spaces/MEASURE/pages/2955970231/How-to+Use+TargetApps+in+Statsig)
			// for details on using targetApp.
			targetApp: 'jira_web',
			// [Optional] Must be one of the strings from the exported enum PerimeterType.
			// If provided, will build base url for the `feature-flag-service` based on environment and perimeter type, and
			// will disable all logging to Statsig in perimeters where it is prohibited..
			perimeter: PerimeterType.FEDRAMP_MODERATE,
		},
		new Provider(/* ... */),
		{
			// These are expected identifiers, you must provide them if they are relevant to your product and will be added to exposures events
			analyticsAnonymousId: '<analyticsAnonymousId>',
			atlassianAccountId: '<aaid>',
			atlassianOrgId: '<orgid>',
			tenantId: '<tenantid>',
			transactionAccountId: '<transactionAccountId>',
			trelloUserId: '<trelloUserId>',
			trelloWorkspaceId: '<trelloWorkspaceId>',
		},
		{
			// These are additional custom attributes that can be used for targeting and will be added to exposure events
			exampleCustomAttribute: '<attributeValue>',
		},
	);
} catch (err) {
	console.error('Failed to initialize FeatureGates client.', err);
}
```

If your application has a log-in flow or other mechanism that makes it possible for the user to
change during a session, then you can use the `updateUserWithProvider` method to apply this change.
This method will use the same provider and options provided in `initializeWithProvider`. It takes
the identifiers and custom attributes of the new user. that relate to the network call it will
perform to fetch the new set of values.

**IMPORTANT**: Calling this method will completely re-initialize the client with a new set of flags.
You will need to re-render the entire page after this completes to ensure everything picks up the
new flag values. You should avoid using this frequently as it has implications on the user
experience.

```typescript
import FeatureGates, {
	FeatureGateEnvironment,
	FeatureGateProducts,
} from '@atlaskit/feature-gate-js-client';

try {
	await FeatureGates.updateUserWithProvider(
		{
			// These are expected identifiers, you must provide them if they are relevant to your product and will be added to exposures events
			analyticsAnonymousId: '<analyticsAnonymousId>',
			atlassianAccountId: '<aaid>',
			atlassianOrgId: '<orgid>',
			tenantId: '<tenantid>',
			transactionAccountId: '<transactionAccountId>',
			trelloUserId: '<trelloUserId>',
			trelloWorkspaceId: '<trelloWorkspaceId>',
		},
		{
			// These are additional custom attributes that can be used for targeting and will be added to exposure events
			exampleCustomAttribute: '<attributeValue>',
		},
	);
} catch (err) {
	console.error('Failed to update the FeatureGates user.', err);
}
```

### Evaluation

In order to evaluate a gate:

```typescript
import FeatureGates from '@atlaskit/feature-gate-js-client';

// Note: this checkGate call will automatically fire an exposure event
if (FeatureGates.checkGate('gateName')) {
	// do something here
}
```

In order to evaluate an experiment:

```typescript
import FeatureGates from '@atlaskit/feature-gate-js-client';

// Note: this call will automatically fire an exposure event
if (FeatureGates.getExperimentValue('myExperiment', 'myBooleanParameter', false)) {
	// do something here
}
```

In order to use more complex experiment configuration:

```typescript
import FeatureGates from '@atlaskit/feature-gate-js-client';

// You can provide an optional function like this to reject any incoming values that don't meet your expectations.
// If this function does not pass, the default value will be returned instead.
const isHexCode = (value: unknown) =>
	typeof value === 'string' && value.startsWith('#') && value.length === 7;

// Note: this call will automatically fire an exposure event. You can provide "fireExposureEvent: false" in the options if you wish to suppress it.
const buttonColor: string = FeatureGates.getExperimentValue(
	'myExperiment',
	'myButtonColorStringParameter',
	'#000000',
	{
		typeGuard: isHexCode,
	},
);
```

#### Exposure Event Logging

Exposure events are batched and sent to Statsig every 10 seconds. Statsig's domain for their event
logging API is blocked by some ad blockers, so by default we are proxying these requests through
`xp.atlassian.com` to reduce exposure loss.

### Subscriptions

To subscribe to changes to gates. The callback will be called when the check gate value changes.

```typescript
import FeatureGates from '@atlaskit/feature-gate-js-client';

const unsubscribe = FeatureGates.onGateUpdated('gateName', () => {});

// To unsubscribe
unsubscribe();
```

To subscribe to changes to experiment values. The callback will be called when the experiment value
changes.

```typescript
import FeatureGates from '@atlaskit/feature-gate-js-client';

const unsubscribe = FeatureGates.onExperimentValueUpdated(
	'myExperiment',
	'myButtonColorStringParameter',
	'#000000',
	() => {},
	{
		typeGuard: isHexCode,
	},
);

// To unsubscribe
unsubscribe();
```

To subscribe to whenever a new set of values is updated on the client, no matter if the underlying
values have changed.

```typescript
import FeatureGates from '@atlaskit/feature-gate-js-client';

// Note: The callback will be called whenever a new set of values is set even if none of the values in the set have changed.
const unsubscribe = FeatureGates.onAnyUpdated(() => {});

// To unsubscribe
unsubscribe();
```

### Multiple clients on a single page

Typically we don't allow multiple usages of the feature gate client on a single page because the
client makes a lot of heavy network calls which could have a drastic performance impact for
customers if many clients were to exist on a single page. However there are some cases where a
seperate client to the product is absolutely necessary. We expose a way to instantiate a new client
instead of using the static methods for this case.

Due to the performance implications **please ask us in #help-statsig-switcheroo before using the
standalone client** so that we can check if there are any alternative solutions that won't impact
customers and make us aware of the cases where separate clients are necessary.

```typescript
import FeatureGateClient from '@atlaskit/feature-gate-js-client/client';

const featureGates = new FeatureGateClient();

// Usage is the same as the static API
await featureGates.initialize({
	// ...
});
featureGates.checkGate('my-gate');
```

## Testing

### Jest

#### Testing initialization states

You can test the various initialization states by mocking the return values for `initialize` and
`updateUser`. Note that you will also need to mock `initializeCalled`, as this is usually updated by
the real `initialize` function.

```typescript
import FeatureGates from '@atlaskit/feature-gate-js-client';

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	...jest.requireActual('@atlaskit/feature-gate-js-client'),
	initializeCalled: jest.fn(),
	initialize: jest.fn(),
	updateUser: jest.fn(),
}));

const MockedFeatureGates = jest.mocked(FeatureGates);

describe('with successful initialization', () => {
	beforeEach(() => {
		MockedFeatureGates.initializeCalled.mockReturnValue(true);
		MockedFeatureGates.initialize.mockResolvedValue();
		MockedFeatureGates.updateUser.mockResolvedValue();
	});

	afterEach(() => jest.resetAllMocks());
});

describe('with failed initialization', () => {
	beforeEach(() => {
		MockedFeatureGates.initializeCalled.mockReturnValue(true);
		MockedFeatureGates.initialize.mockRejectedValue();
		MockedFeatureGates.updateUser.mockRejectedValue();
	});

	afterEach(() => jest.resetAllMocks());
});

describe('with pending initialization', () => {
	// These can be called within your tests transition from the pending
	// initialization state into a successful/failed state.
	let resolveInitPromise;
	let rejectInitPromise;
	beforeEach(() => {
		const initPromise = new Promise((resolve, reject) => {
			resolveInitPromise = resolve;
			rejectInitPromise = reject;
		});
		MockedFeatureGates.initializeCalled.mockReturnValue(true);
		MockedFeatureGates.initialize.mockReturnValue(initPromise);
		MockedFeatureGates.updateUser.mockReturnValue(initPromise);
	});

	afterEach(() => jest.resetAllMocks());
});
```

#### Overriding values

There are two ways that you can override values in Jest tests:

1. Using mocks
2. Using the built-in override methods

#### Using mocks

```typescript
import FeatureGates, { DynamicConfig, EvaluationReason } from '@atlaskit/feature-gate-js-client';

jest.mock('@atlaskit/feature-gate-js-client', () => ({
	...jest.requireActual('@atlaskit/feature-gate-js-client'),
	getExperiment: jest.fn(),
	checkGate: jest.fn(),
}));

const MockedFeatureGates = jest.mocked(FeatureGates);

describe('with mocked experiments and gates', () => {
	beforeEach(() => {
		const overrides = {
			configs: {
				'example-experiment': {
					cohort: 'variation',
				},
			},
			gates: {
				'example-gate': true,
			},
		};

		MockedFeatureGates.getExperiment.mockImplementation((experimentName) => {
			const values = overrides.configs[experimentName] || {};
			return new DynamicConfig(experimentName, values, {
				time: Date.now(),
				reason: EvaluationReason.LocalOverride,
			});
		});

		MockedFeatureGates.checkGate.mockImplementation((gateName, defaultValue) => {
			return overrides.gates[gateName] || defaultValue;
		});
	});

	afterEach(() => jest.resetAllMocks());
});
```

#### Using overrides methods

```typescript
import FeatureGates, { FeatureGateEnvironment } from '@atlaskit/feature-gate-js-client';

describe('with overridden gates and experiments', () => {
	beforeAll(async () => {
		// setOverrides can only be called if the client is _actually_ initialized. You can't mock the initialization, you will have invoke it properly.
		await FeatureGates.initializeWithValues(
			{
				environment: FeatureGateEnvironment.Development,
				sdkKey: 'client-default-key',
				localMode: true,
			},
			{},
			{},
		);
	});

	beforeEach(() => {
		const overrides = {
			configs: {
				'example-experiment': {
					cohort: 'variation',
				},
			},
			gates: {
				'example-gate': true,
			},
		};

		FeatureGates.setOverrides(overrides);
	});

	afterEach(() => FeatureGates.clearAllOverrides());
});
```

### Cypress

#### Overriding values

The `.visit` command in Cypress creates a new window with its own instance of FeatureGates, so you
will not be able to simply import the module and apply stubs to it.

```typescript
// ❌ This will not work!

import FeatureGates, { LocalOverrides } from '@atlaskit/feature-gate-js-client';

const overrides: LocalOverrides = {
	configs: {
		'example-experiment': {
			cohort: 'variation',
		},
	},
	gates: {
		'example-gate': true,
	},
};

// These interact with the FeatureGates instance that your test framework is running in
cy.stub(
	FeatureGates,
	'checkGate',
	(gateName, defaultValue) => overrides.gates[gateName] || defaultValue,
);

cy.stub(FeatureGates, 'getExperiment', (experimentName) => {
	const values = overrides.configs[experimentName] || {};
	return new DynamicConfig(experimentName, values, {
		time: Date.now(),
		reason: EvaluationReason.LocalOverride,
	});
});

// This will creates a new window, with its own FeatureGates instance.
cy.visit('http://localhost:3000/');

// The test feature will not exist since the stubs don't exist on the visited window.
cy.get('#test-feature').dblclick();
```

Instead, you will need to obtain a reference to the client that exists on the generated window, and
apply your overrides to that instead.

We have exposed a `window.__FEATUREGATES_JS__` variable which will contain the instance attached to
the window.

```typescript
// ✅ Do this instead!

import { LocalOverrides } from '@atlaskit/feature-gate-js-client';

const overrides: LocalOverrides = {
	configs: {
		'example-experiment': {
			cohort: 'variation',
		},
	},
	gates: {
		'example-gate': true,
	},
};

cy.visit('http://localhost:3001', {
	// onLoad provides a reference to the generated window, and it is also only invoked when all scripts have finished loading, so the __FEATUREGATES_JS__
	// variable will be available at this point.
	onLoad: (contentWindow) => {
		const FeatureGates = contentWindow.__FEATUREGATES_JS__;

		// Note that the client would not have been initialized by this point, so we can't use the override* or setOverrides methods.
		// We also don't want to wait until the initialization completes, because then the page may have already started to render without these overrides.
		cy.stub(
			FeatureGates,
			'checkGate',
			(gateName, defaultValue) => overrides.gates[gateName] || defaultValue,
		);

		cy.stub(FeatureGates, 'getExperiment', (experimentName) => {
			const values = overrides.configs[experimentName] || {};
			return new DynamicConfig(experimentName, values, {
				time: Date.now(),
				reason: EvaluationReason.LocalOverride,
			});
		});
	},
});
```

You can also set up your own custom command which listens to the next `window:load` event to do the
same thing, which you can invoke before any page visit:

```typescript
import { LocalOverrides } from '@atlaskit/feature-gate-js-client';

Cypress.Commands.add('featureGateOverrides', (overrides: LocalOverrides) => {
	// Use cy.once instead of cy.on so that this only affects the next visit.
	cy.once('window:load', (contentWindow) => {
		const FeatureGates = contentWindow.__FEATUREGATES_JS__;

		cy.stub(
			FeatureGates,
			'checkGate',
			(gateName, defaultValue) => overrides?.gates?.[gateName] || defaultValue,
		);

		cy.stub(FeatureGates, 'getExperiment', (experimentName) => {
			const values = overrides?.configs?.[experimentName] || {};

			return new DynamicConfig(experimentName, values, {
				time: Date.now(),
				reason: EvaluationReason.LocalOverride,
			});
		});
	});
});

// Once the command has been added, you can use it in any of your tests like this
cy.featureGateOverrides({
	configs: {
		'example-experiment': {
			cohort: 'variation',
		},
	},
	gates: {
		'example-gate': true,
	},
}).visit('http://localhost:3001');
```

### Storybook

#### Overriding values

Storybook does not have any mocking or stubbing APIs, but you can use the `override*` and
`setOverrides` methods on this client as a replacement.

Please note that the client must be initialized before these methods can be called, and that the
overrides will need to be cleared after each storybook is unmounted, since they are persisted to
localStorage.

The easiest way to get set up is to use the `FeatureGatesInitializationWithDefaults` component in
our React SDK (`@atlassian/feature-gates-react`) with the `overrides` prop set, since this manages
the initialization and clean-up for you. Please see the
[component documentation](../../docs/react-sdk/FEATURE_GATES_INITIALIZATION_WITH_DEFAULTS.md) for
more information.

## Development

### How do I get set up?

- Summary of set up
  - This repo package uses yarn
  - Run `yarn install` in the root directory to set up your git hooks.
  - In order to get started run `yarn` to install the dependencies
- How to run tests
  - In order to run all tests simply run `yarn test packages/measurement/feature-gate-js-client`
    from the platform directory
  - In order to run jest tests in watch mode while doing development run `yarn test:jest --watch`
  - NOTE: You may need to run `yarn build @atlaskit/feature-gate-js-client` to create a version.ts
    file thats required for some tests

### Contribution guidelines

- All new logic must be tested
  - There is no need to test direct pass through of Statsig APIs
  - Transformation of arguments counts as new logic
- Code review
  - Changes must go through a pull request to be merged
- Other guidelines

### Releasing

This package is part of the AFP monorepo. Create a changeset using `yarn changeset` and commit.
[Documentation](https://hello.atlassian.net/wiki/spaces/AF/pages/2630205905/Releasing+Packages)

### Who do I talk to?

This repo is owned by the experimentation platform team, reach out to !disturbed in
[#help-switcheroo-statsig](https://atlassian.enterprise.slack.com/archives/C04PR2YE4UC) if you need
a hand.
