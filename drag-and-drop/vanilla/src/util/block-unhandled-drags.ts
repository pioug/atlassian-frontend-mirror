import { bindAll, UnbindFn } from 'bind-event-listener';

let unbind: UnbindFn | null = null;

function block(event: DragEvent) {
  // if `@atlaskit/drag-and-drop` has already prevented the event
  // we don't need to do anything
  if (event.defaultPrevented) {
    return;
  }
  // using "none" as the drop effect as that uses the standard
  // cursor. Doing this so the user doesn't think they are dropping
  // on the page
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'none';
  }
  // cancel the default browser behaviour
  // doing this will tell the browser that we have handled the drop
  event.preventDefault();
}

/** Block drag operations outside of `@atlaskit/drag-and-drop` */
export function blockUnhandledDrags() {
  // we are unbinding rather than leveraging a previous binding
  // so that we know that the event listeners are added after
  // the lifecycle-manager listeners
  unbind?.();
  unbind = bindAll(window, [
    {
      type: 'dragover',
      listener: block,
    },
    {
      type: 'dragenter',
      listener: block,
    },
    {
      type: 'drop',
      listener: block,
    },
  ]);
}

export function restoreStandardBehaviour() {
  unbind?.();
  unbind = null;
}
