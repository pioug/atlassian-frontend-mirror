import { ActionSubject, EventType } from '../analytics/enums';
import { toNativeBridge } from './web-to-native';

export function trackFontSizeUpdated(
  defaultFontSize: string,
  actualFontSize: string,
) {
  const fontScale = Number(actualFontSize) / Number(defaultFontSize);

  const fontSizeEvent = {
    action: 'fontSizeChanged',
    actionSubject: ActionSubject.EDITOR,
    eventType: EventType.TRACK,
    attributes: {
      scale: fontScale,
      defaultFontSize: defaultFontSize,
      currentFontSize: actualFontSize,
    },
    tags: ['editor'],
  };

  toNativeBridge.trackEvent(JSON.stringify(fontSizeEvent));
}
