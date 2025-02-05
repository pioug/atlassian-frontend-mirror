/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import type { SimpleTagProps } from './types';

interface ContentProps extends SimpleTagProps {
	isRemovable?: boolean;
}

// To be removed with platform-component-visual-refresh (BLU-2992)
const baseStylesOld = css({
	maxWidth: '180px',
	font: token('font.body'),
	overflow: 'hidden',
	paddingInlineEnd: token('space.050', '4px'),
	paddingInlineStart: token('space.050', '4px'),
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

const baseStyles = css({
	maxWidth: '180px',
	font: token('font.body'),
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

// To be removed with platform-component-visual-refresh (BLU-2992)
const linkStylesOld = css({
	color: 'var(--ds-ctl)',
	pointerEvents: 'auto',
	textDecoration: 'none',

	'&:hover': {
		color: 'var(--ds-cth)',
		textDecoration: 'underline',
	},

	'&:active': {
		color: 'var(--ds-ctp)',
		textDecoration: 'underline',
	},

	'&:focus': {
		outline: 'none',
	},
});

const linkStyles = css({
	color: token('color.text'),
	pointerEvents: 'auto',
	textDecoration: 'none',

	'&:hover': {
		color: token('color.text'),
		textDecoration: 'underline',
	},

	'&:active': {
		color: token('color.text'),
		textDecoration: 'underline',
	},

	'&:focus': {
		outline: 'none',
	},
});

const hasAfterStylesOld = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxWidth: '160px',
	paddingInlineEnd: token('space.200', '16px'),
});

const hasAfterStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxWidth: '160px',
});

// To be removed with platform-component-visual-refresh (BLU-2992)
const hasBeforeStyles = css({
	marginInlineStart: token('space.250', '20px'),
});

const Content = ({
	elemBefore = null,
	isRemovable = true,
	text = '',
	color = 'standard',
	href,
	linkComponent,
}: ContentProps) => {
	const Link = linkComponent ?? 'a';

	if (href) {
		return (
			<Link
				href={href}
				data-color={color}
				css={[
					fg('platform-component-visual-refresh') ? baseStyles : baseStylesOld,
					fg('platform-component-visual-refresh') ? linkStyles : linkStylesOld,
					!fg('platform-component-visual-refresh') && elemBefore && hasBeforeStyles,
					isRemovable && fg('platform-component-visual-refresh') && hasAfterStyles,
					isRemovable && !fg('platform-component-visual-refresh') && hasAfterStylesOld,
				]}
			>
				{text}
			</Link>
		);
	} else {
		return (
			<span
				css={[
					fg('platform-component-visual-refresh') ? baseStyles : baseStylesOld,
					!fg('platform-component-visual-refresh') && elemBefore && hasBeforeStyles,
					isRemovable && fg('platform-component-visual-refresh') && hasAfterStyles,
					isRemovable && !fg('platform-component-visual-refresh') && hasAfterStylesOld,
				]}
			>
				{text}
			</span>
		);
	}
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Content;
