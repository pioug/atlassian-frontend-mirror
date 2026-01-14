import { type Token, type TokenStream } from 'antlr4ts';
import { Interval } from 'antlr4ts/misc/Interval';

import { type Position } from '../common/types';

export const getMatchedText = (
	tokenStream: TokenStream,
	startTokenIndex: number,
	stopToken: Token,
	caretSelectionRange: Position,
): string => {
	const matchedText = tokenStream.getText(Interval.of(startTokenIndex, stopToken.tokenIndex));

	const [caretStartPosition] = caretSelectionRange;
	const tokenStopPosition = stopToken.stopIndex + 1;

	// We only want to return the text preceding the caret. If our caret starts before our stop token
	// ends then we need to slice all the characters after the caret from our matched text.
	if (caretStartPosition < tokenStopPosition) {
		const end = caretStartPosition - tokenStopPosition;
		return matchedText.slice(0, end);
	}
	return matchedText;
};
