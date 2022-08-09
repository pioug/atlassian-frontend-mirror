import { MutableRefObject, RefObject, useEffect, useRef } from 'react';

/**
 * Focusing on the passed element ref after initial mount.
 * Will only focus on initial mount.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/autofocus
 *
 * ```tsx
 * import useAutoFocus from '@atlaskit/ds-lib/use-auto-focus';
 *
 * const elementRef = useRef();
 * useAutoFocus(elementRef, true);
 *
 * <button ref={elementRef} />;
 * ```
 *
 * @param ref
 * @param autoFocus
 */
export default function useAutoFocus(
  ref:
    | RefObject<HTMLElement | null | undefined>
    | MutableRefObject<HTMLElement | null | undefined>
    | undefined,
  autoFocus: boolean,
) {
  const initialMount = useRef(true);

  useEffect(() => {
    if (ref && initialMount.current && autoFocus && ref.current) {
      ref.current.focus();
    }

    initialMount.current = false;
  }, [autoFocus, ref]);
}
