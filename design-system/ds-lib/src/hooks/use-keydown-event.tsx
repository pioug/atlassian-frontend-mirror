import { useEffect } from 'react';

/**
 * Conditionally attaches a keydown event to window.
 * This event will not flow through the React event system,
 * which means it could add lots of event listeners affecting performance.
 * Use with caution.
 *
 * ```
 * useKeydownEvent(callback, isPopupOpen);
 * ```
 *
 * @param callback Ensure a stable reference else you will have your event bound/unbound unexpectedly.
 * @param cond Boolean which controls if an event should be attached or not
 */
export default function useKeydownEvent(
  callback: (ev: KeyboardEvent) => any,
  cond: boolean = true,
) {
  useEffect(() => {
    cond && window.addEventListener('keydown', callback);

    return () => window.removeEventListener('keydown', callback);
  }, [callback, cond]);
}
