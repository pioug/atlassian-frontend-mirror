import { FileState } from '../models/file-state';

export type EventPayloadMap<P> = {
  readonly [event: string]: P;
};

export type EventPayloadListener<
  M extends EventPayloadMap<P>,
  E extends keyof M,
  P = any
> = (payload: M[E]) => void;

export interface MediaViewedEventPayload {
  fileId: string;
  viewingLevel:
    | 'minimal' // Smaller card was displayed
    | 'full' // Full resolution / video playback
    | 'download'; // Media was downloaded
  isUserCollection?: boolean; // This will be true only if attachment is shown in media picker
}

export type UploadEventPayloadMap = {
  'file-added': FileState;
  'media-viewed': MediaViewedEventPayload;
};
