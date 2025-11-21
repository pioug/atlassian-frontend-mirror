import React, { memo, useEffect, useState } from 'react';
import { isMediaEmoji } from '../../util/type-helpers';
import {
	type EmojiDescription,
	type EmojiId,
	type EmojiProvider,
	UfoEmojiTimings,
} from '../../types';
import debug from '../../util/logger';
import Emoji, { type Props as EmojiProps } from './Emoji';
import EmojiPlaceholder from './EmojiPlaceholder';
import EmojiFallback from './EmojiFallback';
import { UfoErrorBoundary } from './UfoErrorBoundary';
import {
	sampledUfoRenderedEmoji,
	ufoExperiences,
	useSampledUFOComponentExperience,
} from '../../util/analytics';
import { SAMPLING_RATE_EMOJI_RENDERED_EXP } from '../../util/constants';
import { hasUfoMarked } from '../../util/analytics/ufoExperiences';
import { useEmoji } from '../../hooks/useEmoji';
import { useCallback } from 'react';
import { extractErrorInfo } from '../../util/analytics/analytics';

export interface State {
	cachedEmoji?: EmojiDescription;
	invalidImage?: boolean;
}

export interface CachingEmojiProps extends EmojiProps {
	placeholderSize?: number;
}

/**
 * Renders an emoji from a cached image, if required.
 */
export const CachingEmoji = (
	props: React.PropsWithChildren<CachingEmojiProps>,
): React.JSX.Element => {
	// Optimisation to only render CachingMediaEmoji if necessary
	// slight performance hit, which accumulates for a large number of emoji.
	const { emoji, placeholderSize, ...restProps } = props;
	// start emoji rendered experience, it may have already started earlier in `ResourcedEmoji`.
	useSampledUFOComponentExperience(
		ufoExperiences['emoji-rendered'].getInstance(emoji.id || emoji.shortName),
		SAMPLING_RATE_EMOJI_RENDERED_EXP,
		{ source: 'CachingEmoji', emojiId: emoji.id },
	);

	useEffect(() => {
		if (!hasUfoMarked(sampledUfoRenderedEmoji(emoji), 'fmp')) {
			sampledUfoRenderedEmoji(emoji).markFMP();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const emojiNode = () => {
		if (isMediaEmoji(emoji)) {
			return <CachingMediaEmoji emoji={emoji} placeholderSize={placeholderSize} {...restProps} />;
		}
		return <StandardEmoji emoji={emoji} {...restProps} />;
	};

	return (
		<UfoErrorBoundary
			experiences={[
				ufoExperiences['emoji-rendered'].getInstance(props.emoji.id || props.emoji.shortName),
			]}
		>
			{emojiNode()}
		</UfoErrorBoundary>
	);
};

const StandardEmoji = (props: React.PropsWithChildren<EmojiProps>) => {
	const { emoji, ...restProps } = props;
	const [imageLoadError, setImageLoadError] = useState(false);

	const handleLoadError = (_emojiId: EmojiId) => {
		setImageLoadError(true);
	};

	if (imageLoadError) {
		return <EmojiFallback emoji={emoji} {...restProps} />;
	}

	return <Emoji emoji={emoji} onLoadError={handleLoadError} {...restProps} />;
};

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

	return (
		<EmojiPlaceholder
			size={fitToHeight || placeholderSize}
			shortName={shortName}
			showTooltip={showTooltip}
			representation={representation}
		/>
	);
};

export default memo(CachingEmoji);
