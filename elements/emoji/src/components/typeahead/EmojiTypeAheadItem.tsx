/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import { jsx } from '@compiled/react';

import type { EmojiDescription, EmojiProvider, OnEmojiEvent } from '../../types';
import { type EmojiTypeAheadWidth } from '../../util/shared-styles';
import { EmojiTypeAheadItemInternal } from './EmojiTypeAheadItemInternal';

export interface Props {
	emoji: EmojiDescription;
	emojiProvider?: EmojiProvider;
	forwardedRef?: React.Ref<HTMLDivElement>;
	onMouseMove: OnEmojiEvent;
	onSelection: OnEmojiEvent;
	selected: boolean;
}

export const typeAheadWidth: EmojiTypeAheadWidth = 350;

export const EmojiTypeAheadItem: React.ForwardRefExoticComponent<
	Props & React.RefAttributes<HTMLDivElement>
> = React.forwardRef<HTMLDivElement, Props>((props, ref) => (
	<EmojiTypeAheadItemInternal {...props} forwardedRef={ref} />
));

export default EmojiTypeAheadItem;

/**
 * @deprecated Use `import { EmojiTypeAheadItemInternal } from '@atlaskit/emoji/emoji-type-ahead-item'` instead.
 */
export { EmojiTypeAheadItemInternal } from './EmojiTypeAheadItemInternal';
