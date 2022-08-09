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

const block: React.DOMAttributes<HTMLElement> = {
  onMouseDownCapture: abort,
  onMouseUpCapture: abort,
  // because we have tabIndex = -1 when disabled,
  // keyboard events can only occur when there is an overlay
  onKeyDownCapture: onKey,
  onKeyUpCapture: onKey,
  onTouchStartCapture: abort,
  onTouchEndCapture: abort,
  onPointerDownCapture: abort,
  onPointerUpCapture: abort,
  onClickCapture: abort,
  // Just smashing the existing onClick for good measure
  onClick: abort,
};

const doNotBlock: React.DOMAttributes<HTMLElement> = {};

export default function blockEvents({
  isInteractive,
}: {
  isInteractive: boolean;
}): React.DOMAttributes<HTMLElement> {
  return isInteractive ? doNotBlock : block;
}
