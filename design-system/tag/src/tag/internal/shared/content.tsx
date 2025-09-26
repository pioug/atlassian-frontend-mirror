/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

import type { SimpleTagProps } from './types';

interface ContentProps extends SimpleTagProps {
	isRemovable?: boolean;
}

const baseStyles = css({
	maxWidth: '180px',
	font: token('font.body'),
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
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

const hasAfterStyles = css({
	maxWidth: '160px',
});

const Content = ({
	elemBefore = null,
	isRemovable = true,
	text = '',
	color = 'standard',
	href,
	linkComponent,
	testId,
}: ContentProps) => {
	const Link = linkComponent ?? 'a';

	if (href) {
		return (
			<Link
				href={href}
				data-color={color}
				data-testid={testId ? `${testId}--link` : undefined}
				css={[baseStyles, linkStyles, isRemovable && hasAfterStyles]}
			>
				{text}
			</Link>
		);
	} else {
		return <span css={[baseStyles, isRemovable && hasAfterStyles]}>{text}</span>;
	}
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Content;
