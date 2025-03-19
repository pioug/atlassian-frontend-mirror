/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { css, jsx } from '@compiled/react';
import { token } from '@atlaskit/tokens';
import { N30 } from '@atlaskit/theme/colors';

import type { EmojiDescription, EmojiProvider, OnEmojiEvent } from '../../types';
import { EmojiCommonProvider } from '../../context/EmojiCommonProvider';
import { leftClick } from '../../util/mouse';
import { toEmojiId } from '../../util/type-helpers';

import { EmojiPreviewComponent } from '../common/EmojiPreviewComponent';

import { type EmojiTypeAheadWidth } from '../../util/shared-styles';
import { typeaheadSelected } from './styles';

export interface Props {
	onMouseMove: OnEmojiEvent;
	onSelection: OnEmojiEvent;
	selected: boolean;
	emoji: EmojiDescription;
	emojiProvider?: EmojiProvider;
	forwardedRef?: React.Ref<HTMLDivElement>;
}

const typeAheadWidth: EmojiTypeAheadWidth = 350;
const typeAheadItem = css({
	cursor: 'pointer',
	display: 'block',
	listStyleType: 'none',
	overflow: 'hidden',
	width: `${typeAheadWidth}px`,
});

const selectedStyles = css({
	backgroundColor: token('color.background.neutral', N30),
});

const typeAheadItemRow = css({
	display: 'flex',
	flexDirection: 'row',
	flexWrap: 'wrap',
	verticalAlign: 'middle',
});

export function EmojiTypeAheadItemInternalCompiled(props: Props) {
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
			{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={`ak-emoji-typeahead-item ${selected ? typeaheadSelected : ''}`}
				css={[typeAheadItem, selected && selectedStyles]}
				onMouseDown={onEmojiSelected}
				onMouseMove={onEmojiMenuItemMouseMove}
				data-emoji-id={emoji.shortName}
				ref={forwardedRef}
			>
				<div css={[typeAheadItemRow]}>{emoji && <EmojiPreviewComponent emoji={emoji} />}</div>
			</div>
		</EmojiCommonProvider>
	);
}
