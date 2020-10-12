import React from 'react';
import { code, md, Example, AtlassianInternalWarning } from '@atlaskit/docs';

export default md`
${(<AtlassianInternalWarning />)}

  This client makes it easy to work with feature flags and dark features.
  By using it, exposure events will be fired automatically allowing analysis of important metrics out of the box.

  ## Usage

  ### Bootstrap
  ${code`
  import FrontendFeatureFlagClient from '@atlaskit/feature-flag-client';

  const client = new FrontendFeatureFlagClient({
    analyticsHandler: myAnalyticsHandler,
    flags: {
      'my.experiment': {
        value: 'experiment',
        explanation: {
          reason: 'RULE_MATCH',
          ruleId: '111-bbbbb-ccc',
        },
      },
      'my.boolean.flag': {
        value: false
      },
      'my.json.flag': {
        value: {
          nav: 'blue',
          footer: 'black',
        },
        explanation: {
          reason: 'RULE_MATCH',
          ruleId: '111-bbbbb-ccc',
        },
      },
      'my.detailed.boolean.flag': {
        value: false,
        explanation: {
          reason: 'RULE_MATCH',
          ruleId: '111-bbbbb-ccc',
        },
      },
    },
  });
  `}

  ### Retrieving values
  ${code`
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
  `}

  ### Setting flags asynchronously?
  If you load your flags after the app bootstrap, you set the to the client through the 'setFlags' method.

  ${code`
  client.setFlags({
    'my.async.boolean.flag': {
      value: false,
      explanation: {
        reason: 'RULE_MATCH',
        ruleId: '333-bbbbb-ccc',
      },
    }
  });
  `}


  ### How to avoid firing the exposure event?
  You can skip the exposure event by setting 'shouldTrackExposureEvent' to 'false'

  ${code`
  client.getBooleanValue('my.detailed.boolean.flag', {
    default: true,
    shouldTrackExposureEvent: false,
  });
  `}

  ### How to fire the exposure event manually?

  ${code`
  client.trackExposure('my.detailed.boolean.flag', {
    value: true,
    explanation: {
      reason: 'RULE_MATCH',
      ruleId: 'aaaa-vbbbb-ccccc'
    }
  });
  `}

  ${(
    <Example
      Component={require('../examples/00-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}
`;
