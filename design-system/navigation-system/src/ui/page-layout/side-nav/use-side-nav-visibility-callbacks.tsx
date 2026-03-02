import { useEffect, useRef } from 'react';

import usePreviousValue from '@atlaskit/ds-lib/use-previous-value';

import { type SideNavTrigger } from './types';

export type VisibilityCallback = (args: {
	screen: 'mobile' | 'desktop';
	trigger?: SideNavTrigger | null;
}) => void;

/**
 * Calls the `onExpand` and `onCollapse` callbacks as required.
 * This is used for both user-provided callbacks, as well as internal callbacks to respond to visibility state changes.
 */
export function useSideNavVisibilityCallbacks({
	onExpand,
	onCollapse,
	isExpandedOnDesktop,
	isExpandedOnMobile,
	lastTrigger,
}: {
	onExpand?: VisibilityCallback;
	onCollapse?: VisibilityCallback;
	isExpandedOnDesktop: boolean;
	isExpandedOnMobile: boolean;
	lastTrigger: SideNavTrigger | null;
}): void {
	// Wrapping in refs so we can call them in `useEffect` without changes to them triggering the `useEffect`
	const onExpandRef = useRef(onExpand);
	const onCollapseRef = useRef(onCollapse);
	useEffect(() => {
		onExpandRef.current = onExpand;
		onCollapseRef.current = onCollapse;
	}, [onExpand, onCollapse]);

	const previousIsExpandedOnDesktop = usePreviousValue(isExpandedOnDesktop);
	useEffect(() => {
		if (
			previousIsExpandedOnDesktop === undefined ||
			previousIsExpandedOnDesktop === isExpandedOnDesktop
		) {
			/**
			 * The previous value is `undefined` on initialization, so if it is `undefined` then the value hasn't changed.
			 *
			 * The previous value can be equal to the current one if the component re-renders due to something else changing.
			 *
			 * In both cases the value hasn't changed and we don't want to notify consumers.
			 */
			return;
		}

		if (isExpandedOnDesktop) {
			onExpandRef.current?.({ screen: 'desktop', trigger: lastTrigger });
		} else {
			onCollapseRef.current?.({ screen: 'desktop', trigger: lastTrigger });
		}
	}, [previousIsExpandedOnDesktop, isExpandedOnDesktop, lastTrigger]);

	const previousIsExpandedOnMobile = usePreviousValue(isExpandedOnMobile);
	useEffect(() => {
		if (
			previousIsExpandedOnMobile === undefined ||
			previousIsExpandedOnMobile === isExpandedOnMobile
		) {
			/**
			 * The previous value is `undefined` on initialization, so if it is `undefined` then the value hasn't changed.
			 *
			 * The previous value can be equal to the current one if the component re-renders due to something else changing.
			 *
			 * In both cases the value hasn't changed and we don't want to notify consumers.
			 */
			return;
		}

		if (isExpandedOnMobile) {
			onExpandRef.current?.({ screen: 'mobile', trigger: lastTrigger });
		} else {
			onCollapseRef.current?.({ screen: 'mobile', trigger: lastTrigger });
		}
	}, [previousIsExpandedOnMobile, isExpandedOnMobile, lastTrigger]);
}
