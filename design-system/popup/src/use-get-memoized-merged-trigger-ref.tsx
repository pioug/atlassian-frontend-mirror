import { type Dispatch, type SetStateAction, useState } from 'react';

import memoizeOne from 'memoize-one';

/*
 * Get a memoized functional ref for use within a Popup's Trigger.
 * This is still very volatile to change as `prop.isOpen` will regularly change, but it's better than nothing.
 * This is memoized within a component as to not be shared across all Popup instances.
 *
 * This is complex because the inputs are split across three different scopes:
 *  - `props.isOpen`
 *  - `useState.setTriggerRef`
 *  - `renderProps.ref`
 */
export const useGetMemoizedMergedTriggerRef = () => {
	const [getMemoizedMergedTriggerRef] = useState(() =>
		memoizeOne(
			(
				ref: React.RefCallback<HTMLElement> | React.MutableRefObject<HTMLElement> | null,
				setTriggerRef: Dispatch<SetStateAction<HTMLElement | null>>,
				isOpen: boolean,
			) => {
				return (node: HTMLElement | null) => {
					if (node && isOpen) {
						if (typeof ref === 'function') {
							ref(node);
						} else if (ref) {
							ref.current = node;
						}
						setTriggerRef(node);
					}
				};
			},
		),
	);

	return getMemoizedMergedTriggerRef;
};
