import { useEffect } from 'react';

/**
 * Assigns an event listener to the document and cleans up after itself.
 * This event will not flow through the React event system,
 * which means it could add lots of event listeners affecting performance.
 * Use with caution.
 *
 * ```
 * useDocumentEvent('click', callback, true);
 * ```
 *
 * @param eventName
 * @param callback Ensure a stable reference else you will have your event bound/unbound unexpectedly.
 * @param options Ensure a stable reference else you will have your event bound/unbound unexpectedly.
 */
export default function useDocumentEvent<
  TEventName extends keyof DocumentEventMap
>(
  eventName: TEventName,
  callback: (this: Document, ev: DocumentEventMap[TEventName]) => void,
  options?: boolean | AddEventListenerOptions,
): void {
  useEffect(() => {
    document.addEventListener(eventName, callback, options);

    return () => {
      document.removeEventListener(eventName, callback, options);
    };
  }, [eventName, callback, options]);
}
