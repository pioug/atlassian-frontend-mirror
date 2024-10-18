import { md } from '@atlaskit/docs';

export default md`
	# JavaScript Frontend Web Client for Dynamic Configuration.

	## Usage

	Either initialise directly from the feature-flag-service:

	~~~typescript
	import { ConfigClient } from '@atlaskit/web-config-client';

	const config = await ConfigClient.fetch({
		// Base URL of the feature-flag-service
		ffsBaseUrl: 'https://feature-flag-service.ap-southeast-2.dev.atl-paas.net',
		// Your feature-flag-service API key, you can get it from:
		// https://developer.atlassian.com/platform/frontend-feature-flags/resources/api-keys/
		ffsApiKey: 'api-xxxx',
		// User context to evaluate the configuration against
		context: {
			namespace: 'switcheroo_web',
			identifiers: {
				atlassianAccountId: 'asdf',
			},
			metadata: {
				hasSomeTrait: true,
			},
		},
	});
	~~~

	Or, initialise from values:

	~~~typescript
	import { ConfigCollection } from '@atlassian/js-config-client-beta';

	const config = ConfigCollection.fromValues(myValuesPayloadFromMyBackend);
	~~~

	And then start consuming your configuration:

	~~~typescript
	const result = config.getNumber('rate-limit');
	if (result.error) {
		// TODO: handle error
	} else {
		console.log(result.value); // 42
	}
	~~~

	## Modes of Operation

	There are currently 2 modes of operation:

	- **STANDARD**
	- This is the normal mode, everything will work as expected
	- **MINIMAL**
	- Smaller JSON formats are used in order to save on bytes transferred
	- Boolean configurations which are false are not sent
	  - This means that config.getBoolean("my-config") will return { error: NotFound } for any boolean
	    configuration that's false
	  - This is in order to save as much bytes as possible when sending over the configuration
	    payloads

	An example demonstrating the differences:

	~~~typescript
	// --- Standard mode -------------------------------------------------------------------------------
	const config = ConfigCollection.fromValues(STANDARD_PAYLOAD);
	const result = config.getBoolean('my_config');

	if (result.error === ConfigError.NotFound) {
		console.log("The configuration 'my_config' does not exist");
	}

	// --- Minimal mode --------------------------------------------------------------------------------
	const config = ConfigCollection.fromValues(MINIMAL_PAYLOAD);
	const result = config.getBoolean('my_config');

	if (result.error === ConfigError.NotFound) {
		console.log(
			"The configuration 'my_config' does not exist, or it is set to 'false' and was not sent",
		);
	}
	~~~
`;
