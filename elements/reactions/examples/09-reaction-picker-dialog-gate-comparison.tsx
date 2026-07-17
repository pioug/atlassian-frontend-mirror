import React, { useEffect } from 'react';

import { type EmojiProvider } from '@atlaskit/emoji/resource';
import { setBooleanFeatureFlagResolver } from '@atlaskit/platform-feature-flags';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';

import { ReactionPicker } from '../src';

import { Example } from './utils';

/**
 * Feature gate that upgrades the reaction picker panel from `role="group"` to a
 * non-modal `role="dialog"` (see CEPS-5921).
 */
const DIALOG_GATE = 'platform_ceps-5921-a11y-fix-reactions';

const emojiProvider = getEmojiResource() as Promise<EmojiProvider>;

/**
 * Because `fg()` reads a single global resolver, we cannot give two pickers
 * different gate values at the same instant. Instead we flip the resolver in
 * each picker's `onOpen` callback — only one picker panel is open at a time, and
 * `onOpen` runs before the panel (which reads the gate) mounts. Open each picker
 * one at a time and inspect the panel with the browser's accessibility tools:
 *
 * - "Gate ON"  → panel has `role="dialog"` and `aria-modal="false"`.
 * - "Gate OFF" → panel keeps the previous `role="group"`.
 *
 * Both keep the same accessible name ("Add reactions") via `aria-label`.
 */
export default (): React.JSX.Element => {
	// Reset the resolver when leaving the example so we don't leak gate state.
	useEffect(() => {
		setBooleanFeatureFlagResolver(() => false);
		return () => {
			setBooleanFeatureFlagResolver(() => false);
		};
	}, []);

	return (
		<div>
			<Example
				title={'Gate ON — panel exposed as a non-modal dialog (role="dialog", aria-modal="false")'}
				body={
					<ReactionPicker
						emojiProvider={emojiProvider}
						onSelection={() => {}}
						allowAllEmojis
						showAddReactionText
						onOpen={() => setBooleanFeatureFlagResolver((flagKey) => flagKey === DIALOG_GATE)}
					/>
				}
			/>

			<hr role="presentation" />

			<Example
				title={'Gate OFF — panel keeps the previous role="group"'}
				body={
					<ReactionPicker
						emojiProvider={emojiProvider}
						onSelection={() => {}}
						allowAllEmojis
						showAddReactionText
						onOpen={() => setBooleanFeatureFlagResolver(() => false)}
					/>
				}
			/>

			<hr role="presentation" />
		</div>
	);
};
