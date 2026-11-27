import { useEffect } from 'react';

import { expVal } from '@atlaskit/platform-feature-experiments/exp-val';

/** Record exposure only once the eligible Remix control has been committed. */
export const useRemixActionExposure = (isRendered: boolean): void => {
	useEffect(() => {
		if (isRendered) {
			expVal('platform_sl_3p_auth_visualize_exp', 'isEnabled', false);
		}
	}, [isRendered]);
};
