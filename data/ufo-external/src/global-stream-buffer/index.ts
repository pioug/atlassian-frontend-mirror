import { ufowarn } from '../logger';
import {
  ExperienceData,
  SubscribeCallback,
  UFOGlobalEventStreamEvent,
  UFOGlobalEventStreamEventType,
  UFOGlobalEventStreamExperiencePayload,
  UFOGlobalEventStreamSubscribe,
  UFOGlobalEventStreamUnsubscribe,
} from '../types/types';

export type GlobalEventStream = {
  push(event: UFOGlobalEventStreamEvent): void;
  __buffer_only__: boolean;
};

type GlobalEventStreamBuffer = {
  push(event: UFOGlobalEventStreamEvent): void;
  __buffer_only__: boolean;
  getStream: () => Array<UFOGlobalEventStreamEvent>;
};

declare global {
  var __UFO_GLOBAL_EVENT_STREAM__: any;
}

const MAX_EARLY_QUEUE_LENGTH = 250;

export const getGlobalEventStream = (): GlobalEventStream => {
  if (!globalThis.__UFO_GLOBAL_EVENT_STREAM__) {
    const earlyStream: GlobalEventStream = (() => {
      const stream: Array<UFOGlobalEventStreamEvent> = [];
      return {
        __buffer_only__: true,
        push: (event: UFOGlobalEventStreamEvent) => {
          if (stream.length < MAX_EARLY_QUEUE_LENGTH) {
            stream.push(event);
          }
        },
        getStream: () => stream,
      };
    })();

    globalThis.__UFO_GLOBAL_EVENT_STREAM__ = earlyStream;
  }
  return globalThis.__UFO_GLOBAL_EVENT_STREAM__;
};

export const setGlobalEventStream = (eventStream: GlobalEventStream) => {
  if (
    globalThis.__UFO_GLOBAL_EVENT_STREAM__ &&
    !globalThis.__UFO_GLOBAL_EVENT_STREAM__?.__buffer_only__
  ) {
    ufowarn(
      'Global Event Stream already initialised. Ignoring new event stream setup',
    );
    return;
  }

  if (globalThis.__UFO_GLOBAL_EVENT_STREAM__?.__buffer_only__) {
    (globalThis.__UFO_GLOBAL_EVENT_STREAM__ as GlobalEventStreamBuffer)
      .getStream()
      .forEach(eventStream.push.bind(eventStream));
  }

  globalThis.__UFO_GLOBAL_EVENT_STREAM__ = eventStream;
};

export const subscribeEvent = (
  experienceId: string,
  callback: SubscribeCallback,
): UFOGlobalEventStreamSubscribe => {
  return {
    type: UFOGlobalEventStreamEventType.SUBSCRIBE,
    payload: {
      experienceId,
      callback,
    },
  };
};

export const unsubscribeEvent = (
  experienceId: string,
  callback: SubscribeCallback,
): UFOGlobalEventStreamUnsubscribe => {
  return {
    type: UFOGlobalEventStreamEventType.UNSUBSCRIBE,
    payload: {
      experienceId,
      callback,
    },
  };
};

export const experiencePayloadEvent = (
  data: ExperienceData,
): UFOGlobalEventStreamExperiencePayload => {
  return {
    type: UFOGlobalEventStreamEventType.EXPERIENCE_PAYLOAD,
    payload: data,
  };
};
