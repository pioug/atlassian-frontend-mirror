import { cleanProps } from '../..';

describe('cleanProps', () => {
  it('should remove fireAnalyticsEvent and firePrivateAnalyticsEvent', () => {
    const dirty = cleanProps({
      fireAnalyticsEvent: true,
      firePrivateAnalyticsEvent: true,
      clean: true,
    });
    expect(dirty.clean).toBe(true);
    expect(dirty.fireAnalyticsEvent).toBe(undefined);
    expect(dirty.firePrivateAnalyticsEvent).toBe(undefined);
  });
});
