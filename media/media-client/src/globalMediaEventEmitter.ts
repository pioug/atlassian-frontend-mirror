import { mediaState } from '@atlaskit/media-core';
import { UploadEventPayloadMap, EventPayloadListener } from './client/events';

export const globalMediaEventEmitter = {
  on<E extends keyof UploadEventPayloadMap>(
    event: E,
    listener: EventPayloadListener<UploadEventPayloadMap, E>,
  ): void {
    if (mediaState.eventEmitter) {
      mediaState.eventEmitter.on(event, listener);
    }
  },

  off<E extends keyof UploadEventPayloadMap>(
    event: E,
    listener: EventPayloadListener<UploadEventPayloadMap, E>,
  ): void {
    if (mediaState.eventEmitter) {
      mediaState.eventEmitter.off(event, listener);
    }
  },

  emit<E extends keyof UploadEventPayloadMap>(
    event: E,
    payload: UploadEventPayloadMap[E],
  ): boolean | undefined {
    if (mediaState.eventEmitter) {
      return mediaState.eventEmitter.emit(event, payload);
    }
    return undefined;
  },
};
