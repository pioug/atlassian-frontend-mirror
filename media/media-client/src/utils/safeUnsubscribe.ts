import { Subscription } from 'rxjs/Subscription';

// Unsubscribes on the next tick since "next" callback gets called sync and the subscription didn't return anything yet
export const safeUnsubscribe = (subscription: Subscription) => {
  setTimeout(() => subscription && subscription.unsubscribe(), 0);
};
