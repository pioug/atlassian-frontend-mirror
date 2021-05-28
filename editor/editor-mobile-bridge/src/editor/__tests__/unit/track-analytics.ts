import { trackFontSizeUpdated } from '../../track-analytics';
import { toNativeBridge } from '../../web-to-native';

jest.mock('../../../editor/web-to-native');

describe('Font Size Analytics: ', () => {
  it('should correctly log when font size = 18', function () {
    trackFontSizeUpdated('16', '18');

    expect(toNativeBridge.trackEvent).toHaveBeenCalledWith(
      JSON.stringify({
        action: 'fontSizeChanged',
        actionSubject: 'editor',
        eventType: 'track',
        attributes: {
          scale: 1.125,
          defaultFontSize: '16',
          currentFontSize: '18',
        },
        tags: ['editor'],
      }),
    );
  });
});
