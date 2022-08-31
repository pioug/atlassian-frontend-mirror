import { bindAll } from 'bind-event-listener';

import { CleanupFn } from '../internal-types';

function cancel(event: DragEvent) {
  // if `@atlaskit/drag-and-drop` has already prevented the event
  // we don't need to do anything
  if (event.defaultPrevented) {
    return;
  }
  // Using "move" as the drop effect as that uses the standard
  // cursor. Doing this so the user doesn't think they are dropping
  // on the page
  // Note: using "none" will not allow a drop to occur, so we are using "move"
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
  // cancel the default browser behaviour
  // doing this will tell the browser that we have handled the drop
  event.preventDefault();
}

let unbindEvents: CleanupFn | null = null;
/**
 * Block drag operations outside of `@atlaskit/drag-and-drop`
 */
export const cancelUnhandled = {
  start() {
    unbindEvents?.();
    unbindEvents = bindAll(window, [
      {
        type: 'dragover',
        listener: cancel,
      },
      {
        type: 'dragenter',
        listener: cancel,
      },
      {
        type: 'drop',
        listener: cancel,
      },
    ]);
  },
  stop() {
    unbindEvents?.();
    unbindEvents = null;
  },
};
