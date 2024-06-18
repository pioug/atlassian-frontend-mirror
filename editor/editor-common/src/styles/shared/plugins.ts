// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { N30 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const buttonGroupStyle = css({
	display: 'inline-flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > div': {
		display: 'flex',
	},
});

// This style is copied to packages/editor/editor-plugin-ai/src/ui/components/AtlassianIntelligenceToolbarButton/styles.tsx
// If you make change here, change in above file as well.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const separatorStyles = css({
	background: token('color.border', N30),
	width: '1px',
	height: '24px',
	display: 'inline-block',
	margin: `0 ${token('space.100', '8px')}`,
	userSelect: 'none',
});

// This style is copied to packages/editor/editor-plugin-ai/src/ui/components/AtlassianIntelligenceToolbarButton/styles.tsx
// If you make change here, change in above file as well.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const wrapperStyle = css({
	display: 'flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div, > span': {
		display: 'flex',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'> div > div': {
		display: 'flex',
	},
	marginLeft: 0,
	minWidth: 'auto',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const triggerWrapperStyles = css({
	display: 'flex',
});
