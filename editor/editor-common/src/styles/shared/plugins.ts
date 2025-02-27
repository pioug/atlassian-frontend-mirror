// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

import { token } from '@atlaskit/tokens';

/**
 * @private
 * @deprecated use `import { ToolbarButtonGroup } from '@atlaskit/editor-common/ui';` instead
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, -- Ignored via go/DSP-18766
export const buttonGroupStyleBeforeVisualRefresh = css({
	display: 'inline-flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > div': {
		display: 'flex',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'button:not(#local-media-upload-button)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([disabled])::after': {
			border: 'none', // remove blue border when an item has been selected
		},
	},
});

/**
 * @private
 * @deprecated use `import { ToolbarButtonGroup } from '@atlaskit/editor-common/ui';` instead
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const buttonGroupStyle = css({
	display: 'inline-flex',
	alignItems: 'center',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& > div': {
		display: 'flex',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'button:not(#local-media-upload-button)': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([disabled])::after': {
			border: 'none', // remove blue border when an item has been selected
		},
	},
	gap: token('space.050', '4px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	'div[role=group]': {
		gap: token('space.050', '4px'),
	},
});

/**
 * @private
 * @deprecated use `import { ToolbarSeparator } from '@atlaskit/editor-common/ui';` instead
 */
// If you make change here, change in above file as well.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const separatorStyles = css({
	background: token('color.border'),
	width: '1px',
	height: '24px',
	display: 'inline-block',
	margin: `0 ${token('space.100', '8px')}`,
	userSelect: 'none',
});

/**
 * @private
 * @deprecated use `import { ToolbarDropdownWrapper } from '@atlaskit/editor-common/ui';` instead
 */
// If you make change here, change in above file as well.
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([disabled])::after': {
			border: 'none', // remove blue border when an item has been selected
		},
	},
});

/**
 * @private
 * @deprecated use `import { ToolbarDropdownTriggerWrapper } from '@atlaskit/editor-common/ui';` instead
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const triggerWrapperStyles = css({
	display: 'flex',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([disabled])::after': {
			border: 'none', // remove blue border when an item has been selected
		},
	},
});

/**
 * @private
 * @deprecated use `import { ToolbarDropdownTriggerWrapper } from '@atlaskit/editor-common/ui';` instead
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const triggerWrapperStylesWithPadding = css({
	display: 'flex',
	paddingRight: token('space.025', '2px'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors
	button: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors
		'&:not([disabled])::after': {
			border: 'none', //  remove blue border when an item has been selected
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles
export const disableBlueBorderStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
	'&:not([disabled])::after': {
		border: 'none', //  remove blue border when an item has been selected
	},
});
