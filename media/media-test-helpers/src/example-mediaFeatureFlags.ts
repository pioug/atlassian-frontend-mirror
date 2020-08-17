import {
  defaultMediaFeatureFlags,
  MediaFeatureFlags,
} from '@atlaskit/media-common';

export const exampleMediaFeatureFlags: MediaFeatureFlags = {
  ...defaultMediaFeatureFlags,
  // add overrides to simulate what product would pass during local development
  // ** DON'T COMMIT! - TEST TO CHECK THIS EQUALS DEFAULTS WILL FAIL! **
  // you can also use `localStorage[exactFlagName] = true` to enable
  // or `delete localStorage[exactFlagName]` to disable
};
