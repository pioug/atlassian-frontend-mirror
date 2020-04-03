import { CollabEditProvider, CollabEvent } from '../provider';

export const unsubscribeAllEvents = (provider: CollabEditProvider) => {
  const collabEvents: Array<CollabEvent> = [
    'init',
    'connected',
    'data',
    'presence',
    'telepointer',
    'local-steps',
    'error',
  ];

  collabEvents.forEach(evt => {
    provider.unsubscribeAll(evt);
  });
};
