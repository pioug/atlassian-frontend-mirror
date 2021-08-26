import { ButtonClickEventPayload } from './_clickedButton';

export type ZoomButtonClickAttributes = {
  zoomScale: number;
};

export type ZoomInButtonClickEventPayload = ButtonClickEventPayload<
  ZoomButtonClickAttributes
> & {
  actionSubjectId: 'zoomIn';
};

export function createZoomInButtonClickEvent(
  zoomScale: number,
): ZoomInButtonClickEventPayload {
  return {
    eventType: 'ui',
    action: 'clicked',
    actionSubject: 'button',
    actionSubjectId: 'zoomIn',
    attributes: {
      zoomScale: zoomScale,
    },
  };
}
