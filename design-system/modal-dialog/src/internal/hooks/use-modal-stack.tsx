import { useEffect } from 'react';

import useLazyCallback from '@atlaskit/ds-lib/use-lazy-callback';
import useStateRef from '@atlaskit/ds-lib/use-state-ref';

/**
 * Array which holds references to all currently open modal dialogs.
 * This will only work for modal dialogs of the same major version,
 * as the refernce will be different between them.
 *
 * E.g. V11 won't know about any from V12.
 */
const modalStackRegister: Array<Function> = [];

/**
 * Returns the position of the calling modal dialog in the modal dialog stack.
 * `0` is the highest position in the stack, with every subsequent number being "lower" in the stack.
 */
export default function useModalStack(isOpen: boolean): number {
  const [stackIndexRef, setStackIndex] = useStateRef(0);

  // We want to ensure this function **never changes** during the lifecycle of this component.
  // This is why it's assigned to a ref and not in a useMemo/useCallback.
  const updateStack = useLazyCallback(() => {
    const newStackIndex = modalStackRegister.indexOf(updateStack);

    // We access the stack index ref instead of state because this closure will always only
    // have the initial state and not any of the later values.
    if (stackIndexRef.current !== newStackIndex) {
      setStackIndex(newStackIndex);
      stackIndexRef.current = newStackIndex;
    }
  });

  useEffect(() => {
    const currentStackIndex = modalStackRegister.indexOf(updateStack);

    if (isOpen && currentStackIndex === -1) {
      // We are opening the modal dialog.
      // Add ourselves to the modal stack register!
      modalStackRegister.unshift(updateStack);
    }

    if (!isOpen && currentStackIndex !== -1) {
      // We are closing the modal dialog using a wrapping modal transition component.
      // Remove ourselves from the modal stack register!
      // NOTE: Modal dialogs that don't have a wrapping modal transition component won't flow through here!
      // For that scenario we cleanup when the component unmounts.
      modalStackRegister.splice(currentStackIndex, 1);
    }

    // Fire all registered modal dialogs to update their position in the stack.
    modalStackRegister.forEach(cb => cb());
  }, [updateStack, isOpen]);

  useEffect(
    () => () => {
      // Final cleanup just in case this modal dialog did not have a wrapping modal transition.
      const currentStackIndex = modalStackRegister.indexOf(updateStack);
      if (currentStackIndex !== -1) {
        modalStackRegister.splice(currentStackIndex, 1);
        modalStackRegister.forEach(cb => cb());
      }
    },
    [updateStack],
  );

  return stackIndexRef.current;
}
