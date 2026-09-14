import { type TruncateOutput } from './truncateTextTypes';

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
