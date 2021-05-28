import { ActionSubject, EventType } from '../analytics/enums';
import { toNativeBridge } from '../renderer/web-to-native/implementation';

export function trackFontSizeUpdated(
  defaultFontSize: string,
  actualFontSize: string,
) {
  const fontScale = Number(actualFontSize) / Number(defaultFontSize);

  const fontSizeEvent = {
    action: 'fontSizeChanged',
    actionSubject: ActionSubject.RENDERER,
    eventType: EventType.TRACK,
    attributes: {
      scale: fontScale,
      defaultFontSize: defaultFontSize,
      currentFontSize: actualFontSize,
    },
    tags: ['editor'],
  };

  toNativeBridge.call('analyticsBridge', 'trackEvent', {
    event: JSON.stringify(fontSizeEvent),
  });
}
