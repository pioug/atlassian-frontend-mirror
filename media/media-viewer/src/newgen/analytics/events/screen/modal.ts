import { ScreenEventPayload, ScreenAttributes } from '@atlaskit/media-common';

export type ModalEventPayload = Omit<
  ScreenEventPayload<ScreenAttributes, 'mediaViewerModal'>,
  'attributes'
>;

export const createModalEvent = (): ModalEventPayload => ({
  eventType: 'screen',
  action: 'viewed',
  actionSubject: 'mediaViewerModal',
  name: 'mediaViewerModal',
});
