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

const truncateRightStyles = css({
	position: 'relative',
});

export const TruncateRight = ({
	fontSizePX,
	startFixedChars,
	endFixedChars,
	children,
	...props
}: TruncateStyledProps &
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>): JSX.Element => (
	<span
		css={[truncateCommonStyles, truncateRightStyles]}
		style={{
			maxWidth: `calc(
				100% -
					${({ fontSizePX, startFixedChars }: TruncateStyledProps) =>
						fontFaceScaleFactor(fontSizePX) * startFixedChars}
			)`,
		}}
		data-testid="truncate-right"
		{...props}
	>
		{children}
	</span>
);
