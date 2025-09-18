# Environment context library

Provides perimeter-specific URL resolution and helps identify which environment a product is running in.

Read more about the original considerations here:
https://hello.atlassian.net/wiki/spaces/FEDRAMP/pages/2561199256/UI+Isolation

## Ownership
In 2025, ownership of the library was transferred to Regulated Industries. Please reach out to #help-cross-boundary for any help.


## Installation

```sh
npm install @atlaskit/atlassian-context --save
```

## Prerequisites

> **_NOTE:_** Skip these pre-requisites if onboarding onto library for the first time in May 2025 onwards. These pre-requisites are for the original `configure()`, `getATLContextDomain()`, `getATLContextUrl()`, and `isFedRamp()` functions, which be will be deprecated in the nearish future.

In order for `@atlaskit/atlassian-context` to work correctly `window.ATL_CONTEXT_DOMAIN` has to be
set on the page. Products must either have the data already on window or call `configure()`, before
calling any get\*() calls. Otherwise `getATLContextDomain()` and `getATLContextUrl()` will use
fallbacks and potentially return an uncorrected response.

If using the deprecated `isFedRamp()` method, also
`window.UNSAFE_ATL_CONTEXT_BOUNDARY = 'fedramp-moderate' | 'commercial'` has to be set on the page.
Otherwise, you could potentially serve environments with code that it is not relevant to them.

## Setup

> **_NOTE:_** Skip this setup if onboarding onto library for the first time in May 2025 onwards. Access to `window.ATL_CONTEXT_DOMAIN` and `window.UNSAFE_ATL_CONTEXT_BOUNDARY` is only required for the `configure()`, `getATLContextDomain()`, `getATLContextUrl()`, and `isFedRamp()` functions, which be will be deprecated in the nearish future.

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

_Disclaimer:_ This does not need to be invoked for the `isFedrampModerate()`, `isIsolatedCloud()`, `isolatedCloudDomain()`, `isolationContextId()`, `getDomainInContext(...)`, and `getUrlForDomainInContext(...)` functions.

Takes the data, and stores in `window.ATL_CONTEXT_DOMAIN` for later use.

### getATLContextDomain()


_Disclaimer:_ Please use `getDomainInContext(subdomain, environment)` instead of this function, as the deprecation process for this function will begin in the near future.

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


_Disclaimer:_ Please use `getUrlForDomainInContext(subdomain, environment)` instead of this function, as the deprecation process for this function will begin in the near future.

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

_Disclaimer:_ Please use `isFedrampModerate()` instead of this function, as the deprecation process for this function will begin in the near future.

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


### isFedrampModerate()
Returns true if the current perimeter is in FedRAMP-Moderate. 

### isIsolatedCloud()
Returns true if the current perimeter is in Isolated Cloud. 

### isolatedCloudDomain()
Returns the current `ic_domain`. If the current perimeter is not an L2 IC (ex. the current fedramp-moderate or regular commercial), then undefined is returned.


### isolationContextId()
Returns the current isolation context identifier (ex: `ic-123`). If the current perimeter is not an L2 IC (such as if the perimeter is fedramp-moderate or regular commercial), then undefined is returned.



### getDomainInContext(subdomain, environment)
Returns the full domain (including support for Isolation Cloud) for a given Atlassian service or experience. 

Important: Note that the library currently does NOT guarantee that the requested domain exists! It is assumed that when a user requests the full domain for a specific service, they already know the domain exists.


Parameters:

* `subdomain` is a required parameter. This should be the service or Atlassian experience for which the full domain is being requested.

* `environment` is a required parameter. This should be one of `dev`, `staging`, or `prod`.


#### Non-Isolated Cloud Details:

For Non-Isolated Cloud (ex. fedramp-moderate and regular commercial), the perimeter and environment values will be used to create and return the expected domain.

Exceptions to this are stored in the [fullDomainOverride](./src/common/constants/domains.tsx) definitions. If you require a URL Mapping that is inconsistent between perimeters and environments, then you should add an entry to `domains.tsx`.

Examples:
When called in fedramp-moderate:

```js
import { getDomainInContext } from '@atlaskit/atlassian-context';

getDomainInContext('id', 'staging') // returns "id.stg.atlassian-us-gov-mod.com" (id has a full domain override)
getDomainInContext('analytics', 'staging') // returns "analytics.atlassian.com" because `analytics` is a non-varying global domain
getDomainInContext('nonexistent-service', 'staging') // returns "nonexistent-service.stg.atlassian-us-gov-mod.com"
```

When called in (non-isolated) commercial:

```js
import { getDomainInContext } from '@atlaskit/atlassian-context';

getDomainInContext('id', 'prod') // returns "id.atlassian.com"
getDomainInContext('analytics', 'prod') // returns "analytics.atlassian.com"
```



#### Isolated Cloud Details:

For Oasis, one of three domain types are returned: a Reserved Name domain, a namespace subdomain, or an Atlassian services subdomain (see [RFC](https://hello.atlassian.net/wiki/spaces/NSC/pages/4352719139/RFC-3+Oasis+Isolation+Context+External+Public+DNS#Atlassian-owned-base-domain-with-domain-based-routing)).

Reserved names and the namespace subdomains are temporarily being configured in the [ReservedNameMapping and AtlDomainMapping](./src/services/generalized-domain-lookup/constants.tsx) definitions. If a new name has been registered under one of these categories, please raise a PR to update the relevant mapping.

Precedence is as follows: reserved name pattern > namespace pattern > default to the services pattern.

Example:
When called in (isolated) commercial:

```js
import { getDomainInContext } from '@atlaskit/atlassian-context';

getDomainInContext('id') // returns "id.<icLabel>.<baseDomain>"
getDomainInContext('packages') // returns "packages.atl.<icLabel>.<baseDomain>"
getDomainInContext('new-service') // returns "new-service.services.<icLabel>.<baseDomain>"
```

### getUrlForDomainInContext(subdomain, environment)
Returns the full url a given Atlassian service (including support for Isolation Cloud) by appending the current URL scheme to the result of `getDomainInContext(subdomain, environment)`.

```js
import { getUrlForDomainInContext } from '@atlaskit/atlassian-context';

getUrlForDomainInContext('design', 'staging') // --> returns "https://design.atlassian.com"
```
