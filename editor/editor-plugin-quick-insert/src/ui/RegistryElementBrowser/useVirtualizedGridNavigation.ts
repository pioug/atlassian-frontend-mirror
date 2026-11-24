import { useCallback, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

import { getVirtualizedArrowKeyTarget } from './getVirtualizedArrowKeyTarget';

type Navigation = ReturnType<typeof getVirtualizedArrowKeyTarget>;
type NavigationArgs = Parameters<typeof getVirtualizedArrowKeyTarget>[0];
type NavigationResult = ReturnType<Navigation['next']>;
type Navigate = (
	args: NavigationArgs,
	onTarget: (target: Extract<NavigationResult, { done: true }>['value']) => boolean,
	repeat?: boolean,
) => boolean;

export const useVirtualizedGridNavigation = (): {
	cancelNavigation: () => void;
	navigate: Navigate;
	requestedRow: number | undefined;
} => {
	const [requestedRow, setRequestedRow] = useState<number>();
	const pendingNavigation = useRef<NavigationArgs>();

	const cancelNavigation = useCallback(() => {
		pendingNavigation.current = undefined;
		setRequestedRow(undefined);
	}, []);

	const navigate = useCallback<Navigate>(
		(args, onTarget, repeat) => {
			const pending = pendingNavigation.current;
			if (
				repeat &&
				pending?.container === args.container &&
				pending.currentOption === args.currentOption &&
				pending.key === args.key
			) {
				return true;
			}
			pendingNavigation.current = args;
			const { container } = args;
			const ownerDocument = container.ownerDocument;
			const initialFocus = ownerDocument.activeElement;
			const navigation = getVirtualizedArrowKeyTarget(args);
			const findRow = (index: number) =>
				container.querySelector<HTMLElement>(`[data-virtual-row="${index}"]`);

			const advance = (initialStep: NavigationResult): boolean => {
				let step = initialStep;
				while (!step.done) {
					const index = step.value;
					const row = findRow(index);
					if (row) {
						step = navigation.next(row);
						continue;
					}
					// Registrations can disable themselves at render time. Probe one missing row
					// per frame so a run of disabled tiles doesn't block the keyboard event.
					ownerDocument.defaultView?.requestAnimationFrame(() => {
						if (pendingNavigation.current !== args || !container.isConnected) {
							return;
						}
						if (ownerDocument.activeElement !== initialFocus) {
							cancelNavigation();
							return;
						}
						flushSync(() => setRequestedRow(index));
						advance(navigation.next(findRow(index)));
					});
					return true;
				}
				cancelNavigation();
				return onTarget(step.value);
			};

			return advance(navigation.next());
		},
		[cancelNavigation],
	);

	return { cancelNavigation, navigate, requestedRow };
};
