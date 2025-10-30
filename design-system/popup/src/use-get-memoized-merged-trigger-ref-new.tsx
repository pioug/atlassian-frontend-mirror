import { type Dispatch, type SetStateAction, useState } from 'react';

import memoizeOne from 'memoize-one';

/**
 * Here setting ref is not dependent on isOpen flag which is failing in React 18 strict mode
 * Implemented behind ff `platform-design-system-popup-ref` (for regular popup) and
 * `platform-dst-popup-compositional-trigger-ref` (for compositional popup)
 * @returns Function to set trigger ref
 */
export const useGetMemoizedMergedTriggerRefNew = () => {
	const [getMemoizedMergedTriggerRefNew] = useState(() =>
		memoizeOne(
			(
				ref: React.RefCallback<HTMLElement> | React.MutableRefObject<HTMLElement> | null,
				setTriggerRef: Dispatch<SetStateAction<HTMLElement | null>>,
			) => {
				return (node: HTMLElement | null) => {
					if (node) {
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

	return getMemoizedMergedTriggerRefNew;
};
