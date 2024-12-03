/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type FC } from 'react';

import { css, jsx } from '@compiled/react';

import { token } from '@atlaskit/tokens';

type HeaderProps = {
	children: string;
	level?: number;
};

const headerStyles = css({
	color: token('color.text'),
	fontSize: `${20 / 14}em`,
	fontStyle: 'inherit',
	fontWeight: token('font.weight.medium', '500'),
	letterSpacing: `-0.008em`,
	lineHeight: 24 / 20,
	marginBlockEnd: token('space.200', '16px'),
	marginBlockStart: token('space.0', '0px'),
});

/**
 * __Header__
 *
 * Header of Empty State.
 *
 * @internal
 */
const EmptyStateHeader: FC<HeaderProps> = ({ children, level = 4 }) => {
	const Tag = `h${level > 0 && level < 7 ? level : level > 6 ? 6 : 4}` as
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6';

	return <Tag css={headerStyles}>{children}</Tag>;
};

export default EmptyStateHeader;
