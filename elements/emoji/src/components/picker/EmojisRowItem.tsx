/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import type { VirtualItem as VirtualItemContext } from '@tanstack/react-virtual';

import { AbstractItem } from './AbstractItem';
import EmojiPickerEmojiRow, { type Props as EmojiRowProps } from './EmojiPickerEmojiRow';
import { sizes } from './EmojiPickerSizes';

export class EmojisRowItem extends AbstractItem<EmojiRowProps> {
	constructor(props: EmojiRowProps) {
		super(props, sizes.emojiRowHeight);
	}

	renderItem = (context?: VirtualItemContext): JSX.Element => (
		<EmojiPickerEmojiRow {...this.props} virtualItemContext={context} />
	);
}
