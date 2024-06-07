import { css } from '@emotion/react';

// AFP-2532 TODO: Fix automatic suppressions below
// eslint-disable-next-line @atlassian/tangerine/import/entry-points
import { typography } from '@atlaskit/theme';
import { token } from '@atlaskit/tokens';

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

export const spinnerContainerStyles = css({
	flexGrow: 1,
	flexDirection: 'column',
	alignItems: 'center',
});

export const listStyles = css({
	padding: token('space.0', '0px'),
	marginTop: token('space.0', '0px'),
	marginBottom: token('space.0', '0px'),
	marginLeft: 'calc(-1 * var(--link-picker-padding-left))',
	marginRight: 'calc(-1 * var(--link-picker-padding-right))',
	listStyle: 'none',
});

export const listTitleStyles = css(typography.h100(), {
	textTransform: 'uppercase',
	marginTop: 0,
	marginBottom: token('space.050', '4px'),
});
