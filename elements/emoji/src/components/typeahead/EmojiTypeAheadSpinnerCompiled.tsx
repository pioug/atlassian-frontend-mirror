/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx, css } from '@compiled/react';

import Spinner from '@atlaskit/spinner';

import { type EmojiTypeAheadMaxHeight } from '../../util/shared-styles';

const emojiTypeAheadSpinner = css({
	textAlign: 'center',
});

const typeAheadMaxHeight: EmojiTypeAheadMaxHeight = 350;
const emojiTypeAheadSpinnerContainer = css({
	position: 'relative',
	height: `${typeAheadMaxHeight}px`,
	paddingTop: `${(typeAheadMaxHeight - 30) / 2}px`,
	boxSizing: 'border-box',
});

export function EmojiTypeAheadSpinnerCompiled() {
	return (
		<div css={emojiTypeAheadSpinnerContainer}>
			<div css={emojiTypeAheadSpinner}>
				<Spinner size="medium" interactionName="empji-type-ahead-list-spinner" />
			</div>
		</div>
	);
}
