/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

import { jsx } from '@compiled/react';

import { calculateTruncation } from './calculateTruncation';
import { TruncateLeft } from './TruncateLeft-compiled';
import { TruncateRight } from './TruncateRight-compiled';
import { type TruncateProps } from './truncateTextTypes';

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
