import React from 'react';

import { fg } from '@atlaskit/platform-feature-flags';

export const useElementWidth = (
	ref: React.RefObject<HTMLElement>,
	{ skip }: { skip: boolean },
): number | undefined => {
	const [elementWidth, setWidth] = React.useState<number | undefined>(undefined);

	React.useEffect(() => {
		if (!skip && ref.current && !fg('platform_editor_prevent_toolbar_width_reflow')) {
			// eslint-disable-next-line @atlassian/perf-linting/no-chain-state-updates -- Ignored via go/ees017 (to be fixed)
			setWidth(Math.round(ref.current.getBoundingClientRect().width));
		}
	}, [skip, setWidth, ref]);

	return elementWidth;
};
