import { ButtonClickEventPayload } from './_clickedButton';
import { ZoomButtonClickAttributes } from './zoomInButtonClicked';

export type ZoomOutButtonClickEventPayload = ButtonClickEventPayload<
  ZoomButtonClickAttributes
> & {
  actionSubjectId: 'zoomOut';
};

export function createZoomOutButtonClickedEvent(
  zoomScale: number,
): ZoomOutButtonClickEventPayload {
  return {
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: 'zoomOut',
    attributes: {
      zoomScale,
    },
  };
}
