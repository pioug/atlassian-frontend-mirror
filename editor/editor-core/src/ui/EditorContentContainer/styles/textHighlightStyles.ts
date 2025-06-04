// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const textHighlightStyle = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'.text-highlight': {
		backgroundColor: token('color.background.accent.blue.subtlest'),
		borderBottom: `2px solid ${token('color.background.accent.blue.subtler')}`,
	},
});
