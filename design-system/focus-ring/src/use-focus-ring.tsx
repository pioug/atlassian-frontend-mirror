import { useRef, useState } from 'react';

import type { FocusEventHandlers, FocusState } from './types';

/**
 * __Use focus ring__
 *
 * The `useFocusRing` hook is designed to manage focus for the `FocusRing` in cases where the `FocusRing`'s visual application
 * and the element that takes focus, differ. See the `focus` prop of `FocusRing` for more information.
 *
 * @example
 * ```jsx
 * import VisuallyHidden from '@atlaskit/visuall-hidden';
 * import FocusRing, { useFocusRing } from '@atlaskit/focus-ring';
 *
 * const InteractiveComponent = () => {
 *  const { focusState, focusProps } = useFocusRing();
 *
 *  return (
 *    <div>
 *      <VisuallHidden>
 *        <input {...focusProps} />
 *      </VisuallyHidden>
 *      <FocusRing focus={focusState}>
 *        <div role="button">Hello</div>
 *      </FocusRing>
 *    </div>
 *  );
 *
 * }
 * ```
 */
const useFocusRing = (initialState: FocusState = 'off') => {
  const [focusState, setFocusState] = useState<'on' | 'off'>(initialState);
  const focusProps = useRef<FocusEventHandlers>({
    onFocus: () => setFocusState('on'),
    onBlur: () => setFocusState('off'),
  });

  return {
    focusState,
    focusProps: focusProps.current,
  } as const;
};

export default useFocusRing;
