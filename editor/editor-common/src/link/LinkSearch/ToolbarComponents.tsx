// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { RECENT_SEARCH_WIDTH_IN_PX, RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX } from '../../ui';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const inputWrapper = css({
	display: 'flex',
	lineHeight: 0,
	padding: `${token('space.075', '6px')} 0`,
	alignItems: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const container = css({
	display: 'flex',
	flexDirection: 'column',
	overflow: 'auto',
	padding: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${RECENT_SEARCH_WIDTH_WITHOUT_ITEMS_IN_PX}px`,
	lineHeight: 'initial',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const containerWithProvider = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${RECENT_SEARCH_WIDTH_IN_PX}px`,
});
