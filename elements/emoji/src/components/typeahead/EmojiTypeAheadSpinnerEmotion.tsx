/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx, css } from '@emotion/react';

import Spinner from '@atlaskit/spinner';
import { type EmojiTypeAheadMaxHeight } from '../../util/shared-styles';

const typeAheadMaxHeight: EmojiTypeAheadMaxHeight = 350;
const emojiTypeAheadSpinnerContainer = css({
	position: 'relative',
	height: `${typeAheadMaxHeight}px`,
	paddingTop: `${(typeAheadMaxHeight - 30) / 2}px`,
	boxSizing: 'border-box',
});

const emojiTypeAheadSpinner = css({
	textAlign: 'center',
});

export function EmojiTypeAheadSpinnerEmotion() {
	return (
		<div css={emojiTypeAheadSpinnerContainer}>
			<div css={emojiTypeAheadSpinner}>
				<Spinner size="medium" interactionName="empji-type-ahead-list-spinner" />
			</div>
		</div>
	);
}
