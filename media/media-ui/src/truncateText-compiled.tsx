/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';
import { css, jsx } from '@compiled/react';

export type TruncateProps = {
	text: string;
	fontSizePX?: number;
	startFixedChars?: number;
	endFixedChars?: number;
};

export type TruncateOutput = {
	left: string;
	right: string;
};

export const calculateTruncation = (
	text: string,
	startFixedChars: number,
	endFixedChars: number,
): TruncateOutput => {
	const minAllowedLength = endFixedChars + startFixedChars;
	if (text.length <= minAllowedLength) {
		// if no truncation return same value for left and right
		return {
			left: text,
			right: text,
		};
	}
	const splitAt = text.length - endFixedChars;
	const left = text.substr(0, splitAt);
	const right = text.substr(splitAt);
	return {
		left,
		right,
	};
};

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
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
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
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>) => (
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

export type TruncateStyledProps = Omit<Required<TruncateProps>, 'text'>;

const fontFaceScaleFactor = (fontSizePX: number) =>
	(fontSizePX / 11) * 0.46; /* factor for fontSize of 11px */

const placeholder = ' ';

export const Truncate: React.FC<TruncateProps> = ({
	text,
	fontSizePX = 11, // Must be calibrated with fontSize
	startFixedChars = 4, // 1 char + 3 dots
	endFixedChars = 7, // file extension 3/4 chars + a fraction of the name
}) => {
	const { left: leftStr, right: rightStr } = calculateTruncation(
		text,
		startFixedChars,
		endFixedChars,
	);

	return (
		<Fragment>
			<TruncateLeft
				fontSizePX={fontSizePX}
				startFixedChars={startFixedChars}
				endFixedChars={endFixedChars}
			>
				{leftStr}
			</TruncateLeft>
			<TruncateRight
				fontSizePX={fontSizePX}
				startFixedChars={startFixedChars}
				endFixedChars={endFixedChars}
			>
				{leftStr === rightStr ? placeholder : rightStr}
			</TruncateRight>
		</Fragment>
	);
};
