import { type ControlledEvents } from './use-button-base';

function abort(event: React.SyntheticEvent) {
  event.preventDefault();
  event.stopPropagation();
}

const tabKeyCode: number = 9;

function onKey(event: React.KeyboardEvent) {
  // Allowing tab so that a user can move focus away
  if (event.keyCode === tabKeyCode) {
    return;
  }
  abort(event);
}

export default function blockEvents<TagName extends HTMLElement>(
  shouldBlockEvents: boolean,
  events: ControlledEvents<TagName>,
): ControlledEvents<TagName> {
  return shouldBlockEvents
    ? {
        onMouseDownCapture: abort,
        onMouseUpCapture: abort,
        onKeyDownCapture: onKey,
        onKeyUpCapture: onKey,
        onTouchStartCapture: abort,
        onTouchEndCapture: abort,
        onPointerDownCapture: abort,
        onPointerUpCapture: abort,
        onClickCapture: abort,
        // Just smashing the existing onClick for good measure
        onClick: abort,
      }
    : events;
}
