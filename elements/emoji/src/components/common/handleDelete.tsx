/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { type SyntheticEvent } from 'react';

import { toEmojiId } from '../../util/to-emoji-id';
import type { Props } from './Emoji';

export const handleDelete: any = (props: Props, event: SyntheticEvent) => {
	const { emoji, onDelete } = props;
	if (onDelete) {
		onDelete(toEmojiId(emoji), emoji, event);
	}
};
