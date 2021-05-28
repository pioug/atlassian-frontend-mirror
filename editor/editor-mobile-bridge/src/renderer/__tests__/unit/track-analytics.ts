import { trackFontSizeUpdated } from '../../track-analytics';
import { toNativeBridge } from '../../web-to-native/implementation';

jest.mock('../../web-to-native/implementation');

describe('Font Size Analytics: ', () => {
  it('should correctly log when font size = 34', function () {
    trackFontSizeUpdated('17', '34');

    expect(toNativeBridge.call).toHaveBeenCalledWith(
      'analyticsBridge',
      'trackEvent',
      {
        event: JSON.stringify({
          action: 'fontSizeChanged',
          actionSubject: 'renderer',
          eventType: 'track',
          attributes: {
            scale: 2,
            defaultFontSize: '17',
            currentFontSize: '34',
          },
          tags: ['editor'],
        }),
      },
    );
  });
});
