import { MediaSubscription } from './mediaSubscribable';

// TODO: remove this in next major version
export const safeUnsubscribe = (subscription: MediaSubscription) => {
  // eslint-disable-next-line no-console
  console.warn(
    'safeUnsubscribe() is deprecated and will be removed in the next media-client major version',
  );
  setTimeout(() => subscription && subscription.unsubscribe(), 0);
};
