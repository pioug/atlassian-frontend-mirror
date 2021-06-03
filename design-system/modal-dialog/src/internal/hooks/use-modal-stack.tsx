import { useEffect } from 'react';

import useLazyCallback from '@atlaskit/ds-lib/use-lazy-callback';
import usePreviousValue from '@atlaskit/ds-lib/use-previous-value';
import useStateRef from '@atlaskit/ds-lib/use-state-ref';
import { useExitingPersistence } from '@atlaskit/motion/exiting-persistence';

/**
 *  ________________________________________________
 * | MAJOR VERSIONS WILL NOT KNOW ABOUT EACH OTHER! |
 *  ------------------------------------------------
 *
 * An array which holds references to all currently open modal dialogs.
 * This will only work for modal dialogs of the same major version,
 * as the reference will be different between them.
 *
 * E.g. V11 won't know about any from V12.
 */
const modalStackRegister: Array<Function> = [];

interface ModalStackOpts {
  /**
   * Fired when the modal dialog stack has changed.
   */
  onStackChange: (newStackIndex: number) => void;
}

/**
 * Returns the position of the calling modal dialog in the modal dialog stack.
 * Stack index of `0` is the highest position in the stack,
 * with every higher number being behind in the stack.
 */
export default function useModalStack({
  onStackChange,
}: ModalStackOpts): number {
  const { isExiting } = useExitingPersistence();

  const [stackIndexRef, setStackIndex] = useStateRef(0);
  const currentStackIndex = stackIndexRef.current;
  const previousStackIndex = usePreviousValue(stackIndexRef.current);

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

    if (!isExiting && currentStackIndex === -1) {
      // We are opening the modal dialog.
      // Add ourselves to the modal stack register!
      modalStackRegister.unshift(updateStack);
    }

    if (isExiting && currentStackIndex !== -1) {
      // We are closing the modal dialog using a wrapping modal transition component.
      // Remove ourselves from the modal stack register!
      // NOTE: Modal dialogs that don't have a wrapping modal transition component won't flow through here!
      // For that scenario we cleanup when the component unmounts.
      modalStackRegister.splice(currentStackIndex, 1);
    }

    // Fire all registered modal dialogs to update their position in the stack.
    modalStackRegister.forEach((cb) => cb());
  }, [updateStack, isExiting]);

  useEffect(
    () => () => {
      // Final cleanup just in case this modal dialog did not have a wrapping modal transition.
      const currentStackIndex = modalStackRegister.indexOf(updateStack);
      if (currentStackIndex !== -1) {
        modalStackRegister.splice(currentStackIndex, 1);
        modalStackRegister.forEach((cb) => cb());
      }
    },
    [updateStack],
  );

  useEffect(() => {
    if (previousStackIndex === undefined) {
      // Initial case that we don't need to notify about.
      return;
    }

    if (previousStackIndex !== currentStackIndex) {
      onStackChange(currentStackIndex);
    }
  }, [onStackChange, previousStackIndex, currentStackIndex]);

  return currentStackIndex;
}
