import { useState } from 'react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { UNSAFE_useMediaQuery as useMediaQuery } from '@atlaskit/primitives/compiled';

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
	 * This gate removes unnecessary state changes across the below-sm boundary
	 * The state change is only needed if the popup can become a modal - and this is maintained
	 */
	const shouldUseMediaQuery = !fg('platform_dst_popup_media_query_perf_fix') || canBecomeModal;
	const mq = useMediaQuery(
		'below.sm',
		shouldUseMediaQuery
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
