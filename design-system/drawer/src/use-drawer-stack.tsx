import { useEffect } from 'react';

import useLazyCallback from '@atlaskit/ds-lib/use-lazy-callback';
import usePreviousValue from '@atlaskit/ds-lib/use-previous-value';
import useStateRef from '@atlaskit/ds-lib/use-state-ref';

/**
 * **Major versions will not know about each other**
 *
 * An array holding references to all currently open drawers. This only works
 * for drawers of the same major version, because the reference differs between
 * majors (for example V13 will not know about any from V14).
 *
 * Adapted from `useModalStack` in `@atlaskit/modal-dialog`. The top-layer drawer
 * path uses this to know its position in the stack so that only the foreground
 * drawer renders a visible `::backdrop` (this avoids cumulative darkening for
 * nested or stacked drawers). Unlike the modal version, the register is timed
 * off `isOpen` rather than `@atlaskit/motion`'s `useExitingPersistence`: the
 * `Dialog` primitive owns its own exit lifecycle, so the top-layer drawer needs
 * no `ExitingPersistence` wrapper.
 */
const drawerStackRegister: Array<() => void> = [];

type TDrawerStackOpts = {
	/**
	 * Whether the calling drawer is open. The drawer joins the stack while open
	 * and leaves it on close or unmount.
	 */
	isOpen: boolean;
	/**
	 * Fired when the calling drawer's position in the stack changes.
	 */
	onStackChange?: (newStackIndex: number) => void;
};

/**
 * Returns the position of the calling drawer in the drawer stack. A stack index
 * of `0` is the foreground (top of the stack); higher numbers are further back.
 */
export default function useDrawerStack({ isOpen, onStackChange }: TDrawerStackOpts): number {
	const [stackIndexRef, setStackIndex] = useStateRef(0);
	const currentStackIndex = stackIndexRef.current;
	const previousStackIndex = usePreviousValue(stackIndexRef.current);

	// Kept stable for the lifetime of the component so it can be the identity in
	// the shared register. This is why it is a lazy callback and not a
	// useMemo/useCallback value.
	const updateStack = useLazyCallback(() => {
		const newStackIndex = drawerStackRegister.indexOf(updateStack);
		// Read from the ref rather than state: this closure only ever sees the
		// initial state value.
		if (stackIndexRef.current !== newStackIndex) {
			setStackIndex(newStackIndex);
			stackIndexRef.current = newStackIndex;
		}
	});

	useEffect(() => {
		if (!isOpen) {
			return;
		}
		// Opening: join the front of the register (the newest open drawer is the
		// foreground at index 0), then notify every open drawer to recompute.
		if (drawerStackRegister.indexOf(updateStack) === -1) {
			drawerStackRegister.unshift(updateStack);
		}
		drawerStackRegister.forEach((callback) => callback());

		return () => {
			// Closing or unmounting: leave the register and notify the rest.
			const index = drawerStackRegister.indexOf(updateStack);
			if (index !== -1) {
				drawerStackRegister.splice(index, 1);
			}
			drawerStackRegister.forEach((callback) => callback());
		};
	}, [isOpen, updateStack]);

	useEffect(() => {
		if (previousStackIndex === undefined) {
			// Initial render: nothing to notify about.
			return;
		}
		if (previousStackIndex !== currentStackIndex) {
			onStackChange?.(currentStackIndex);
		}
	}, [onStackChange, previousStackIndex, currentStackIndex]);

	return currentStackIndex;
}
