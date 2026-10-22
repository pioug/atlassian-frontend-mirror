import { useState } from 'react';

import { UNSAFE_useMediaQuery as useMediaQuery } from '@atlaskit/primitives/compiled/use-media-query';

/**
 * **usePopupAppearance()**
 *
 * Abstracts away calculating the appearance for a popup including if it should
 * be portalled or not, this is done to ensure that if the popup needs to render
 * as a modal that it is also forcibly portalled. If it's not portalled when rendering
 * as a modal it will appear below the top bar.
 */
export function usePopupAppearance({
	appearance: _appearance,
	shouldRenderToParent: _shouldRenderToParent,
}: {
	appearance: 'default' | 'UNSAFE_modal-below-sm';
	shouldRenderToParent?: boolean;
}): {
	appearance: 'default' | 'UNSAFE_modal-below-sm';
	shouldRenderToParent: boolean | undefined;
} {
	const canBecomeModal = _appearance === 'UNSAFE_modal-below-sm';

	/**
	 * Only subscribe to the below-sm boundary when the popup can become a modal,
	 * to avoid unnecessary state changes for every other popup
	 */
	const mq = useMediaQuery(
		'below.sm',
		canBecomeModal
			? (e) => {
					setIsSmallViewport(!!e.matches);
				}
			: undefined,
	);
	const [isSmallViewport, setIsSmallViewport] = useState(!!mq?.matches);
	const appearance: 'default' | 'UNSAFE_modal-below-sm' =
		canBecomeModal && isSmallViewport ? 'UNSAFE_modal-below-sm' : 'default';
	const shouldRenderToParent = _shouldRenderToParent && appearance === 'default';

	return {
		appearance,
		shouldRenderToParent,
	};
}
