/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { memo } from 'react';

import { css } from '@compiled/react';

import { cssMap, jsx } from '@atlaskit/css';
import __noop from '@atlaskit/ds-lib/noop';
import { Pressable } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

const noop = __noop;

const itemWrapperStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	maxWidth: '100%',
	height: `${24 / 14}em`,
	flexDirection: 'row',
	marginBlockEnd: token('space.0'),
	marginBlockStart: token('space.0'),
	marginInlineEnd: token('space.0'),
	marginInlineStart: token('space.0'),
	paddingBlockEnd: token('space.0'),
	paddingBlockStart: token('space.0'),
	paddingInlineEnd: token('space.0'),
	paddingInlineStart: token('space.0'),
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:not(:last-child)::after': {
		width: token('space.100'),
		flexShrink: 0,
		content: '"/"',
		paddingBlock: token('space.025'),
		paddingInline: token('space.100'),
		textAlign: 'center',
	},
});

const styles = cssMap({
	root: {
		font: token('font.body'),
		backgroundColor: token('color.background.neutral.subtle'),
		padding: '0',
		color: token('color.text.subtlest'),
		border: 'none',
		display: 'inline-flex',
		alignItems: 'center',
		gap: token('space.050'),
		borderRadius: token('radius.small'),
		textDecoration: 'none',

		'&:hover': {
			textDecoration: 'underline',
			color: token('color.text.subtlest'),
		},
		'&:focus': {
			textDecoration: 'none',
			color: token('color.text.subtlest'),
		},
		'&:active': {
			// @ts-expect-error
			color: token('color.text'),
		},
	},
});

interface EllipsisItemProps {
	onClick?: (event: React.MouseEvent<Element>) => void;
	/**
	 * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests.
	 */
	testId?: string;
	/**
	 * A `label` prop is used as aria-label for ellipsis button.
	 */
	label: string;
}

const EllipsisItem: import('react').MemoExoticComponent<
	({ label, onClick, testId }: EllipsisItemProps) => JSX.Element
> = memo(({ label, onClick = noop, testId }: EllipsisItemProps) => (
	<li css={itemWrapperStyles}>
		<Pressable aria-label={label} onClick={onClick} xcss={styles.root} testId={testId}>
			&hellip;
		</Pressable>
	</li>
));

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default EllipsisItem;
