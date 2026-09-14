/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { fg } from '@atlaskit/platform-feature-flags/fg';
import { token } from '@atlaskit/tokens';

import { EmojiCommonProvider } from '../../context/EmojiCommonProvider';
import { leftClick } from '../../util/left-click';
import { toEmojiId } from '../../util/to-emoji-id';
import { EmojiPreviewComponent } from '../common/EmojiPreviewComponent';
import { typeAheadWidth } from './EmojiTypeAheadItem';
import type { Props } from './EmojiTypeAheadItem';
import { typeaheadSelected } from './styles';

const typeAheadItem = css({
	cursor: 'pointer',
	display: 'block',
	listStyleType: 'none',
	overflow: 'hidden',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values
	width: `${typeAheadWidth}px`,
});

const selectedStyles = css({
	backgroundColor: token('color.background.neutral'),
});

const typeAheadItemRow = css({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	verticalAlign: 'middle',
});

export function EmojiTypeAheadItemInternal(props: Props): JSX.Element {
	const { emoji, onSelection, onMouseMove, selected, emojiProvider, forwardedRef } = props;
	const onEmojiSelected = React.useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (leftClick(event) && onSelection) {
				event.preventDefault();
				onSelection(toEmojiId(emoji), emoji, event);
			}
		},
		[emoji, onSelection],
	);

	const onEmojiMenuItemMouseMove = React.useCallback(
		(event: React.MouseEvent<HTMLDivElement>) => {
			if (onMouseMove) {
				onMouseMove(toEmojiId(emoji), emoji, event);
			}
		},
		[emoji, onMouseMove],
	);

	return (
		<EmojiCommonProvider emojiProvider={emojiProvider}>
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={`ak-emoji-typeahead-item ${selected ? typeaheadSelected : ''}`}
				css={[typeAheadItem, selected && selectedStyles]}
				onMouseDown={onEmojiSelected}
				onMouseMove={onEmojiMenuItemMouseMove}
				data-emoji-id={emoji.shortName}
				ref={forwardedRef}
				role={fg('platform_suppression_removal_fix_reactions') ? 'button' : undefined}
			>
				<div css={[typeAheadItemRow]}>{emoji && <EmojiPreviewComponent emoji={emoji} />}</div>
			</div>
		</EmojiCommonProvider>
	);
}
