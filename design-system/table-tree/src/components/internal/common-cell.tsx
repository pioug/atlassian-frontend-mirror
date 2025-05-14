/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { CSSProperties, FC, HTMLAttributes, ReactNode } from 'react';

import { css, jsx } from '@compiled/react';

import { N800 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

const commonStyles = css({
	display: 'flex',
	boxSizing: 'border-box',
	minHeight: 40,
	padding: `${token('space.100', '10px')} ${token('space.300', '25px')} ${token(
		'space.100',
		'10px',
	)} var(--indent, ${token('space.300', '25px')})`,
	position: 'relative',
	alignItems: 'center',
	color: token('color.text', N800),
	font: token('font.body'),
	hyphens: 'auto',
	wordBreak: 'break-word',
});

interface CommonCellProps {
	indent?: string;
	width?: string | number;
	children?: ReactNode;
}

/**
 * __Common cell__
 */
const CommonCell: FC<HTMLAttributes<HTMLDivElement> & CommonCellProps> = ({
	indent,
	width,
	className,
	...props
}) => (
	<div
		role="gridcell"
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
		className={className}
		// eslint-disable-next-line @repo/internal/react/no-unsafe-spread-props
		{...props}
		style={{ '--indent': indent, width } as CSSProperties}
		css={commonStyles}
	/>
);

export default CommonCell;
