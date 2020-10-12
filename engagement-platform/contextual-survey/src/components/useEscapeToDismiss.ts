import { useEffect, useRef } from 'react';

export const escape: number = 27;

function bind(
  target: EventTarget,
  eventName: string,
  handler: EventListener,
  options?: AddEventListenerOptions,
): () => void {
  target.addEventListener(eventName, handler, options);
  return function unbind() {
    target.removeEventListener(eventName, handler, options);
  };
}

type Optional<T> = T | null;

function shouldDismiss(target: Optional<EventTarget>): boolean {
  if (!target) {
    return true;
  }

  if (!(target instanceof HTMLElement)) {
    return true;
  }

  // Closest doesn't exist for ie11
  // Because we cannot be sure if in a text area - just don't allow dismissing
  if (!target.closest) {
    return false;
  }

  const inTextArea: boolean = Boolean(target.closest('textarea'));

  // Allow dismissing if not in a textarea
  return !inTextArea;
}

type Args = {
  onDismiss: () => void;
};
export default function useEscapeToDismiss({ onDismiss }: Args) {
  const onDismissRef = useRef<() => void>(onDismiss);

  // Defensively accounting for consumer passing in a new function
  // each time. We just want to call the latest one
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    let unbind: () => void;

    function onKeyDown(event: KeyboardEvent): void {
      if (event.keyCode !== escape) {
        return;
      }

      // Escape pressed

      // We don't want to close if the user is typing in the text area
      if (!shouldDismiss(event.target)) {
        return;
      }

      if (unbind) {
        // only want to call dismiss once
        unbind();
      }

      onDismissRef.current();
    }

    unbind = bind(
      window,
      'keydown',
      // @ts-ignore: the typescript for this is lame
      onKeyDown,
      { passive: true },
    );

    // double calls to unbind is fine
    return unbind;
  }, []);
}
