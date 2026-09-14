/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { css, jsx } from '@compiled/react';

import { type TruncateStyledProps } from './truncateTextTypes';

// Declared locally rather than shared via an import: @atlaskit/ui-styling-standard/no-imported-style-values
// requires style values to be defined in the same file that uses them.
const fontFaceScaleFactor = (fontSizePX: number) =>
	(fontSizePX / 11) * 0.46; /* factor for fontSize of 11px */

const truncateCommonStyles = css({
	display: 'inline-block',
	verticalAlign: 'bottom',
	whiteSpace: 'nowrap',
	overflow: 'hidden',
});

const truncateLeftStyles = css({
	textOverflow: 'ellipsis',
});

export const TruncateLeft = ({
	fontSizePX,
	startFixedChars,
	endFixedChars,
	children,
	...props
}: TruncateStyledProps &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>): JSX.Element => (
	<span
		css={[truncateCommonStyles, truncateLeftStyles]}
		style={{
			maxWidth: `calc(
		100% -
			${fontFaceScaleFactor(fontSizePX) * endFixedChars + 1}em
	)`,
			minWidth: fontFaceScaleFactor(fontSizePX) * startFixedChars,
		}}
		data-testid="truncate-left"
		{...props}
	>
		{children}
	</span>
);
