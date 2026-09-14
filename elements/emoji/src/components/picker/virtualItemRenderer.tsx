/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { jsx } from '@compiled/react';
import type { VirtualItem as VirtualItemContext } from '@tanstack/react-virtual';

import { type Props as CategoryHeadingProps } from './EmojiPickerCategoryHeading';
import { type Props as EmojiRowProps } from './EmojiPickerEmojiRow';
import { type Props as NoResultsProps } from './EmojiPickerNoResults';
import type { VirtualItem } from './EmojiPickerVirtualItems';

export const virtualItemRenderer = (
	rows: VirtualItem<CategoryHeadingProps | EmojiRowProps | NoResultsProps | {}>[],
	context: VirtualItemContext,
): JSX.Element => {
	const { index, key } = context;
	const row: VirtualItem<CategoryHeadingProps | EmojiRowProps | NoResultsProps | {}> = rows[index];
	return <div key={key}>{row && row.renderItem(context)}</div>;
};
