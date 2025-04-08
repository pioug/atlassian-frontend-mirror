import { useState } from 'react';

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
}) {
	const mq = useMediaQuery('below.sm', (e) => {
		setIsSmallViewport(!!e.matches);
	});
	const [isSmallViewport, setIsSmallViewport] = useState(!!mq?.matches);
	const appearance: 'default' | 'UNSAFE_modal-below-sm' =
		_appearance === 'UNSAFE_modal-below-sm' && isSmallViewport
			? 'UNSAFE_modal-below-sm'
			: 'default';
	const shouldRenderToParent = _shouldRenderToParent && appearance === 'default';

	return {
		appearance,
		shouldRenderToParent,
	};
}
