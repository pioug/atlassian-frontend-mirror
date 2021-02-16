# Feature flag client

This client makes it easy to work with feature flags and dark features.
By using it, exposure events will be fired automatically allowing analysis of important metrics out of the box.

## Usage

### Bootstrap

```javascript
import FrontendFeatureFlagClient from '@atlaskit/feature-flag-client';

const client = new FrontendFeatureFlagClient({
  analyticsHandler: myAnalyticsHandler,
  flags: {
    'my.experiment': {
      value: 'experiment',
      explanation: {
        kind: 'RULE_MATCH',
        ruleId: '111-bbbbb-ccc',
      },
    },
    'my.boolean.flag': {
      value: false,
    },
    'my.json.flag': {
      value: {
        nav: 'blue',
        footer: 'black',
      },
      explanation: {
        kind: 'RULE_MATCH',
        ruleId: '111-bbbbb-ccc',
      },
    },
    'my.detailed.boolean.flag': {
      value: false,
      explanation: {
        kind: 'RULE_MATCH',
        ruleId: '111-bbbbb-ccc',
      },
    },
  },
});
```

### Retrieving values

```javascript
// flag set, returns real value
client.getBooleanValue('my.detailed.boolean.flag', { default: true }); // > false

// flag set, returns real value
client.getVariantValue('my.experiment', {
  default: 'control',
  oneOf: ['control', 'experiment'],
}); // > experiment

// flag unset, returns default value
client.getBooleanValue('my.unlisted.boolean.flag', { default: false }); // > false

// flag value doesn't match expected, returns default
client.getVariantValue('my.experiment', {
  default: 'control',
  oneOf: ['control', 'variant-a'],
}); // > control

client.getJSONFlag('my.json.flag'); // > { nav: 'blue', footer: 'black' }
```

### Setting flags asynchronously?

If you load your flags after the app bootstrap, you set the to the client through the 'setFlags' method.

```javascript
client.setFlags({
  'my.async.boolean.flag': {
    value: false,
    explanation: {
      kind: 'RULE_MATCH',
      ruleId: '333-bbbbb-ccc',
    },
  },
});
```

### How to send exposure events for all feature flags?

You can call the `setAutomaticExposuresMode(enableAutomaticExposures: boolean, automaticAnalyticsHandler: AutomaticAnalyticsHandler) ` method after initialising the client in your app. When this mode is enabled, exposure events will be handled in the following circumstances: sent for all simple flags (ie. flags without an explanation), and for all evalulated (ie. flags with evalauation details) with the `shouldTrackExposureEvent` option set to false.

- Simple Flags: Automatic exposure events will always be fired with the flag key and value
- Evaluated Flags with `shouldTrackExposureEvent: false`: Automatic exposure events will fire with explanation details
- Evaluated Flags with `shouldTrackExposureEvent: true`: Automatic exposure events will not fire, but the regular ones will.

The exposure events that are fired in this fashion will be tagged with an additional tag on the event `tags: ['autoExposure']` to make it easier to differientiate between those exposures fired manually and those fired automatically.

### How to avoid firing the exposure event?

You can skip the exposure event by setting 'shouldTrackExposureEvent' to 'false'. Note: this will not disable the automatic exposure event from firing when the Automode is enabled.

```javascript
client.getBooleanValue('my.detailed.boolean.flag', {
  default: true,
  shouldTrackExposureEvent: false,
});
```

### How to fire the exposure event manually?

```javascript
client.trackExposure('my.detailed.boolean.flag', {
  value: true,
  explanation: {
    kind: 'RULE_MATCH',
    ruleId: 'aaaa-vbbbb-ccccc',
  },
});
```

### How to include custom attributes in the exposure event?

You can send extra attributes by including an object within the `exposureData` attribute. This object accepts strings, numbers or booleans. Reserved attributes can't be used, like `flagKey`, `reason`, `ruleId` or `value`.

```javascript
client.getBooleanValue('my.detailed.boolean.flag', {
  default: true,
  shouldTrackExposureEvent: false,
  exposureData: {
    myAttribute1: 'whatever',
    myAttribute2: 2,
    myAttribute3: true,
  },
});
```

If you are firing the exposure event manually, the 3rd argument (optional) includes the custom attributes. This object accepts strings, numbers or booleans. Reserved attributes can't be used, like `flagKey`, `reason`, `ruleId` or `value`.

```javascript
client.trackExposure(
  'my.detailed.boolean.flag',
  {
    value: true,
    explanation: {
      kind: 'RULE_MATCH',
      ruleId: 'aaaa-vbbbb-ccccc',
    },
  },
  {
    myAttribute1: 'whatever',
    myAttribute2: 2,
    myAttribute3: true,
  },
);
```