import { Subscription } from 'rxjs/Subscription';

// TODO: remove this in next major version
export const safeUnsubscribe = (subscription: Subscription) => {
  // eslint-disable-next-line no-console
  console.warn(
    'safeUnsubscribe() is deprecated and will be removed in the next media-client major version',
  );
  setTimeout(() => subscription && subscription.unsubscribe(), 0);
};
