import {
  getProductSpecificFeatureFlags,
  getCollabProviderFeatureFlag,
} from '../index';

describe('Feature flags', () => {
  it('getProductSpecificFeatureFlags', () => {
    const result = getProductSpecificFeatureFlags(
      {
        testFF: true,
        socketMessageMetricsFF: true,
        sendStepsQueueFF: true,
      },
      'confluence',
    );
    expect(result).toEqual([
      'confluence.frontend.collab.provider.testFF',
      'confluence.frontend.collab.provider.socketMessageMetricsFF',
      'confluence.frontend.collab.provider.sendStepsQueueFF',
    ]);
  });

  it('getCollabProviderFeatureFlag return true', () => {
    const result = getCollabProviderFeatureFlag('testFF', {
      testFF: true,
    });
    expect(result).toEqual(true);
  });

  it('getCollabProviderFeatureFlag with wrong ff set', () => {
    const result = getCollabProviderFeatureFlag('testFF', { abc: true });
    expect(result).toEqual(false);
  });

  it('getCollabProviderFeatureFlag with wrong ff set', () => {
    const result = getCollabProviderFeatureFlag('testFF', undefined);
    expect(result).toEqual(false);
  });
});
