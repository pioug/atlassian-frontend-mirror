/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';
import { css, jsx } from '@compiled/react';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import type { EmojiDescription, EmojiProvider, OnEmojiEvent } from '../../types';
import { EmojiCommonProvider } from '../../context/EmojiCommonProvider';
import { leftClick } from '../../util/mouse';
import { toEmojiId } from '../../util/type-helpers';

import { EmojiPreviewComponent } from '../common/EmojiPreviewComponent';

import { type EmojiTypeAheadWidth } from '../../util/shared-styles';
import { typeaheadSelected } from './styles';

export interface Props {
	emoji: EmojiDescription;
	emojiProvider?: EmojiProvider;
	forwardedRef?: React.Ref<HTMLDivElement>;
	onMouseMove: OnEmojiEvent;
	onSelection: OnEmojiEvent;
	selected: boolean;
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

const EmojiTypeAheadItem: React.ForwardRefExoticComponent<
	Props & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, Props>((props, ref) => (
	<EmojiTypeAheadItemInternal {...props} forwardedRef={ref} />
));

export default EmojiTypeAheadItem;
