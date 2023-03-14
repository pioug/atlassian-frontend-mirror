# @atlaskit/platform-feature-flags

Allows usage of feature flags in platform components.

## Registration

Feature flags are required to be registered in their respective package before they will be available in the api.
This is because the types used in this package are dynamically generated based on flags defined in their "package.json".
Definitions can be like so:

```json5
{
  'platform-feature-flags': {
    'flag-name': {
      type: 'boolean',
      // required
    },
  },
}
```

