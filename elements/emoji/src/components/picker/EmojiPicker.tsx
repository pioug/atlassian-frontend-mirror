/* eslint-disable @repo/internal/deprecations/deprecation-ticket-required -- VOLTC-139 tracks removal of these deprecated re-export shims. */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React from 'react';

import withAnalyticsEvents, {
	type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next/withAnalyticsEvents';

import type { OnEmojiEvent, PickerSize } from '../../types';
import { type Props as LoadingProps } from '../common/LoadingEmojiComponent';
import type { PickerRefHandler } from './EmojiPickerComponent';
import { EmojiPickerInternal } from './EmojiPickerInternal';

export interface Props extends LoadingProps {
	/**
	 * The current Confluence page content id. When provided (and the
	 * `confluence_ai_generated_emojis` experiment is on), enables the
	 * "Create an emoji with Rovo" AI generation section in the upload flow.
	 */
	contentId?: string;
	/**
	 * Flag to disable tone selector.
	 */
	hideToneSelector?: boolean;
	/**
	 * Callback to handle picker reference.
	 */
	onPickerRef?: PickerRefHandler;
	/**
	 * Callback to be executed on emoji selection.
	 */
	onSelection?: OnEmojiEvent;
	/**
	 * Size of Emoji Picker. default value is 'medium'.
	 */
	size?: PickerSize;
}

export const EmojiPicker: React.ForwardRefExoticComponent<
	Omit<Props & WithAnalyticsEventsProps, keyof WithAnalyticsEventsProps> & React.RefAttributes<any>
> = withAnalyticsEvents()<
	Props & WithAnalyticsEventsProps,
	React.ComponentType<Props & WithAnalyticsEventsProps>
>(EmojiPickerInternal as any);

export default EmojiPicker;

/**
 * @deprecated Use `import { preloadEmojiPicker } from '@atlaskit/emoji/emoji-picker'` instead.
 */
export { preloadEmojiPicker } from './preloadEmojiPicker';
/**
 * @deprecated Use `import { EmojiPickerInternal } from '@atlaskit/emoji/emoji-picker'` instead.
 */
export { EmojiPickerInternal } from './EmojiPickerInternal';
/**
 * @deprecated Use `import { emojiPickerModuleLoader } from '@atlaskit/emoji/emoji-picker'` instead.
 */
export { emojiPickerModuleLoader } from './emojiPickerModuleLoader';
/**
 * @deprecated Use `import { emojiPickerLoader } from '@atlaskit/emoji/emoji-picker'` instead.
 */
export { emojiPickerLoader } from './emojiPickerLoader';
