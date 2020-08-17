import { exampleMediaFeatureFlags } from '../example-mediaFeatureFlags';
import { defaultMediaFeatureFlags } from '@atlaskit/media-common';

describe('Example MediaFeatureFlags', () => {
  it('should equal defaultMediaFeatureFlags', () => {
    expect(exampleMediaFeatureFlags).toEqual(defaultMediaFeatureFlags);
  });
});
