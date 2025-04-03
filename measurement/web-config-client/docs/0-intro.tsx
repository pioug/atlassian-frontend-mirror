import { md } from '@atlaskit/docs';

export default md`
	# JavaScript Frontend Web Client for Dynamic Configuration.

	## Usage

	Either initialise directly from the feature-flag-service:

	~~~typescript
	import { ConfigClient } from '@atlaskit/web-config-client';

	const config = await ConfigClient.fetch({
		// Base URL of the feature-flag-service
		ffsBaseUrl: 'https://api.dev.atlassian.com/flags',
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

	Or, initialise from values, where the values could come from your own service:

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

	## Options

	### API key

	The Feature Flag Service API key for your target app. This is not a secret and is allowed to be
	checked into your frontend codebase. The list of existing keys can be found
	[here](https://developer.atlassian.com/platform/frontend-feature-flags/resources/api-keys/). If
	your target app does not have the keys you need already, you can create new ones here:

	- [Commercial](https://hello.help.atlassian.cloud/servicedesk/customer/portal/3450/group/4513/create/37729)
	- [FEDRAMP](https://hello.help.atlassian.cloud/servicedesk/customer/portal/3450/group/4513/create/39322)

	### Feature Flag Service base urls

	- Production: https://api.atlassian.com/flags
	- Staging: https://api.stg.atlassian.com/flags
	- Development: https://api.dev.atlassian.com/flags
	- FEDRAMP staging: https://api.stg.atlassian-us-gov-mod.com/flags
	- FEDRAMP production: https://api.atlassian-us-gov-mod.com/flags
	- Stargate: ~/gateway/api/flags~

	### Context

	#### Namespace

	This is the name of your target app.

	#### Identifiers

	Values used for targeting in rules. See documentation for allowed identifiers
	[here](https://hello.atlassian.net/wiki/spaces/ED4/pages/2838426703/How+to+Setup+Identifiers+in+Statsig).

	#### Metadata

	For targeting in rules under "custom fields". This is a dictionary where the keys and values can
	be anything you want. These have less capabilities than identifiers and are not standardized so
	identifiers should be used if possible.
`;
