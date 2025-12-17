import { useEffect } from 'react';

import { setGlobalTheme } from '@atlaskit/tokens';

export const useVrGlobalTheme = (): void => {
	useEffect(() => {
		// If the theme has been set, dont do anything
		if (document.documentElement.dataset.theme) {
			return;
		}
		// Light theme is activated by default
		setGlobalTheme({ colorMode: 'light' });
	}, []);
};
