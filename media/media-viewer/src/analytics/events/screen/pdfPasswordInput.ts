import { ScreenEventPayload, ScreenAttributes } from '@atlaskit/media-common';

export type PdfPasswordInputScreenEventPayload = Omit<
  ScreenEventPayload<ScreenAttributes, 'mediaViewerPdfPasswordInputScreen'>,
  'attributes'
>;

export const createPdfPasswordInputScreenEvent =
  (): PdfPasswordInputScreenEventPayload => ({
    eventType: 'screen',
    action: 'viewed',
    actionSubject: 'mediaViewerPdfPasswordInputScreen',
    name: 'mediaViewerPdfPasswordInputScreen',
  });
