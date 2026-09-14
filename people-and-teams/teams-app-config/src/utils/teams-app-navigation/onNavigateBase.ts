import type React from 'react';

import type { NavigationActionCommon } from '../../common/types';
import { openInNewTab } from '../../common/utils/openInNewTab';
import { redirect } from '../../common/utils/redirect';

export const onNavigateBase: any =
	(href: string, config: NavigationActionCommon) =>
	(e?: React.MouseEvent | React.KeyboardEvent): void => {
		if (e) {
			e.preventDefault();
		}

		if (config.shouldOpenInSameTab) {
			redirect(href);
			return;
		}
		openInNewTab(href);
	};
