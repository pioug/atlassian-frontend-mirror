import { unstable_batchedUpdates } from 'react-dom';

export const batchedUpdate = (cb: () => void): void => {
  unstable_batchedUpdates(cb);
};
