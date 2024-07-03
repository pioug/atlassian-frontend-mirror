// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';
// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { colors } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const codeViewWrapperStyles = css({
	position: 'absolute',
	left: 0,
	top: 0,
	right: 0,
	bottom: 0,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	backgroundColor: token('elevation.surface', colors.N20),
	overflow: 'auto',
});

/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const codeViewerHeaderBarStyles = css({
	height: '75px',
	backgroundColor: '#1d2125',
});
/* eslint-enable @atlaskit/design-system/ensure-design-token-usage */

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const codeViewerHTMLStyles = css({
	display: 'flex',
	lineHeight: '20px',
	overflowX: 'auto',
	whiteSpace: 'pre',
	fontSize: '12px',
	padding: token('space.100', '8px'),
});
