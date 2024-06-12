# Environment context library

Provides FedRAMP-friendly URLs and helps to identify if product is running in FedRAMP environment.

Read more about it here:
https://hello.atlassian.net/wiki/spaces/FEDRAMP/pages/2561199256/UI+Isolation

## Installation

```sh
npm install @atlaskit/atlassian-context --save
```

## Prerequisites

In order for `@atlaskit/atlassian-context` to work correctly `window.ATL_CONTEXT_DOMAIN` has to be
set on the page. Products must either have the data already on window or call `configure()`, before
calling any get\*() calls. Otherwise `getATLContextDomain()` and `getATLContextUrl()` will use
fallbacks and potentially return an uncorrected response.

If using the deprecated `isFedRamp()` method, also
`window.UNSAFE_ATL_CONTEXT_BOUNDARY = 'fedramp-moderate' | 'commercial'` has to be set on the page.
Otherwise, you could potentially serve environments with code that it is not relevant to them.

## Setup

This library must be initialised in order to return the correct results. How it gets initialised
will depend on your service. The configuration data may be loaded by any Micros service from
[Config Registry](https://bitbucket.org/atlassian/shared-environment-config). For any further help,
reach out to [#help-config-injector](https://atlassian.enterprise.slack.com/archives/C0611PE6WDU).

**⚠️ Warning: `window.MICROS_PERIMETER` will be replaced by `window.UNSAFE_ATL_CONTEXT_BOUNDARY` in
future iterations - see [go-is-fedramp](https://go.atlassian.com/is-fedramp).**

- `window.MICROS_PERIMETER` - see [go-is-fedramp](https://go.atlassian.com/is-fedramp) \*

### Server Generated HTML

_Recommended_

If your service always generates static HTML, you can leverage window context to correctly configure
this library. Consider this Velocity template snippet as an example:

```html
<!-- Assuming your Java service has loaded the appropriate configuration into $domain_config -->

<script nonce="$nonce">
	window.ATL_CONTEXT_DOMAIN = $domain_config.stringify();
</script>

<!-- Assuming your Java service has loaded the micros perimeter into $micros_perimeter.
    NOTE: Only needed if your service uses the isFedRamp function
  -->
<script nonce="nonce">
	window.UNSAFE_ATL_CONTEXT_BOUNDARY = $micros_perimeter.stringify();
</script>
```

The library will automatically initialise with this configuration if the variable is found. If the
config isn’t available it will use fallbacks and potentially return uncorrected values.

### Serverless

_Discourage: This will regress your apps performance. Your page is no longer serverless, due to its
requirement for FedRAMP config. You should move to server-based hosting._

Before render, you must fetch the data

```js
import { configure } from '@atlaskit/atlassian-context';

function init(){
  // get the config from globaledge
  const data = await fetch('https://my.backend.api/_config/domains');

  // tell @atlaskit/atlassian-context about it
  configure(data)

  // and only then run other code / render your page
  ReactDOM.render(<YourApp />, element)
}
```

If your application is rendered through React SSR, you should ensure you will need to manually
invoke the `configure()` function with the provided data.

## API

### configure()

Takes the data, and stores in `window.ATL_CONTEXT_DOMAIN` for later use.

### getATLContextDomain()

Returns the domain for a given Atlassian service. It relies on `window.ATL_CONTEXT_DOMAIN` be
present on the page, in case `window.ATL_CONTEXT_DOMAIN` is undefined `getATLContextDomain()` will
try to retrieve the value from a list of hardcoded domains, which could be not up to date. The
fallback relies on `window.UNSAFE_ATL_CONTEXT_BOUNDARY` be present on the page, if undefined
`getATLContextDomain()` will fallback to non-fedramp (commercial) value.

```js
import { getATLContextDomain } from '@atlaskit/atlassian-context';

getATLContextDomain('jira'); // jira.atlassian.com OR jira.atlassian-fex.com depending based on environment
getATLContextDomain('confluence'); // confluence.atlassian.com
getATLContextDomain('admin'); // admin.atlassian.com OR admin.atlassian-fex.com
```

### getATLContextUrl()

Returns the full `url` for a given Atlassian service. Being based off `getATLContextDomain`, it
relies on `window.ATL_CONTEXT_DOMAIN` be present on the page, otherwise `getATLContextDomain` will
try to retrieve the value from a list of hardcoded domains, which could be not up to date and
potentially fallback to non-fedramp (commercial) value.

`getATLContextUrl()` detects browser protocol (http/https) and applies it to `domain`.

```js
import { getATLContextUrl } from '@atlaskit/atlassian-context';

getATLContextUrl('jira'); // https://jira.atlassian.com OR https://jira.atlassian-fex.com depending based on environment
getATLContextUrl('confluence'); // https://confluence.atlassian.com
getATLContextUrl('admin'); // https://admin.atlassian.com OR https://admin.atlassian-fex.com
```

### isFedRamp()

_Caution: Consider Alternatives_ Use of this function is not recommended as a long term solution, as
it creates an assumption there are no other isolated environments than just FedRAMP Moderate. You
are encouraged to consider alternate solutions, such as Statsig or environment configuration, that
don’t require creating a hard dependency between your code features and the FedRAMP environment -
see [go-is-fedramp](https://go.atlassian.com/is-fedramp)

Returns whether the service is deployed in the FedRAMP boundary. `isFedRamp()` relies on
`window.UNSAFE_ATL_CONTEXT_BOUNDARY` be present on the page, in case
`window.UNSAFE_ATL_CONTEXT_BOUNDARY` is undefined it will try to identify the environment based on
the site domain, eventually fallback to false.

```js
import { isFedRamp } from '@atlaskit/atlassian-context';

if (isFedRamp()) {
	// your specific logic here
}
```
