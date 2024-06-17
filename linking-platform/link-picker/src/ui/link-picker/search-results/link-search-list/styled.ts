// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css } from '@emotion/react';

// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { typography } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const listContainerStyles = css({
	width: '100%',
	paddingTop: 0,
	minHeight: '80px',
	marginTop: token('space.200', '16px'),
	marginBottom: token('space.200', '16px'),
	flexGrow: 1,
	display: 'flex',
	flexDirection: 'column',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const spinnerContainerStyles = css({
	flexGrow: 1,
	flexDirection: 'column',
	alignItems: 'center',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css -- Ignored via go/DSP-18766
export const listStyles = css({
	padding: token('space.0', '0px'),
	marginTop: token('space.0', '0px'),
	marginBottom: token('space.0', '0px'),
	marginLeft: 'calc(-1 * var(--link-picker-padding-left))',
	marginRight: 'calc(-1 * var(--link-picker-padding-right))',
	listStyle: 'none',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles, @atlaskit/design-system/no-exported-css, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
export const listTitleStyles = css(typography.h100(), {
	textTransform: 'uppercase',
	marginTop: 0,
	marginBottom: token('space.050', '4px'),
});
