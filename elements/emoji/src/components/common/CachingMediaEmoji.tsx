import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';

import { useEmoji } from '../../hooks/useEmoji';
import {
	type EmojiDescription,
	type EmojiId,
	type EmojiProvider,
	UfoEmojiTimings,
} from '../../types';
import { extractErrorInfo } from '../../util/analytics/extractErrorInfo';
import { sampledUfoRenderedEmoji } from '../../util/analytics/sampledUfoRenderedEmoji';
import debug from '../../util/logger';
import type { CachingEmojiProps } from './CachingEmoji';
import Emoji from './Emoji';
import EmojiPlaceholder from './EmojiPlaceholder';

/**
 * Rendering a media emoji image from a cache for media emoji, with different
 * rendering paths depending on caching strategy.
 */
export const CachingMediaEmoji = (
	props: React.PropsWithChildren<CachingEmojiProps>,
): React.JSX.Element => {
	const { emoji, placeholderSize, showTooltip, fitToHeight, children, ...restProps } = props;
	const { shortName, representation } = emoji;
	const [cachedEmoji, setCachedEmoji] = useState<EmojiDescription>();
	const [inValidImage, setInvalidImage] = useState(false);

	const { emojiProvider } = useEmoji();

	const loadEmoji = useCallback(
		(emojiProvider: EmojiProvider) => {
			debug('Loading image via media cache', emoji.shortName);
			sampledUfoRenderedEmoji(emoji).mark(UfoEmojiTimings.MEDIA_START);
			emojiProvider
				.getMediaEmojiDescriptionURLWithInlineToken(emoji)
				.then((cachedEmoji) => {
					setCachedEmoji(cachedEmoji);
					setInvalidImage(false);
					sampledUfoRenderedEmoji(emoji).mark(UfoEmojiTimings.MEDIA_END);
				})
				.catch((error) => {
					setCachedEmoji(undefined);
					setInvalidImage(true);
					sampledUfoRenderedEmoji(emoji).failure({
						metadata: {
							error: extractErrorInfo(error),
							reason: 'failed to load media emoji',
							source: 'CachingMediaEmoji',
							emojiId: emoji.id,
						},
					});
				});
		},
		[emoji],
	);

	useEffect(() => {
		if (emojiProvider) {
			loadEmoji(emojiProvider);
		}
	}, [emojiProvider, loadEmoji]);

	const handleLoadError = (_emojiId: EmojiId) => {
		sampledUfoRenderedEmoji(_emojiId).failure({
			metadata: {
				reason: 'load error',
				source: 'CachingMediaEmoji',
				emojiId: _emojiId.id,
			},
		});
		setInvalidImage(true);
	};

	if (cachedEmoji && !inValidImage) {
		return (
			<Emoji
				{...restProps}
				showTooltip={showTooltip}
				fitToHeight={fitToHeight}
				emoji={cachedEmoji}
				onLoadError={handleLoadError}
			/>
		);
	}

	const imageRepresentation =
		representation && 'height' in representation ? representation : undefined;

	return (
		<EmojiPlaceholder
			size={fitToHeight || placeholderSize}
			shortName={shortName}
			showTooltip={showTooltip}
			representation={imageRepresentation}
		/>
	);
};
