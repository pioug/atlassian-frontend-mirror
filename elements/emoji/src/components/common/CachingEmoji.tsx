import React, { memo, useEffect, useState } from 'react';

import { type EmojiDescription, type EmojiId } from '../../types';
import { hasUfoMarked } from '../../util/analytics/hasUfoMarked';
import { sampledUfoRenderedEmoji } from '../../util/analytics/sampledUfoRenderedEmoji';
import { ufoExperiences } from '../../util/analytics/ufoExperiences';
import { useSampledUFOComponentExperience } from '../../util/analytics/useSampledUFOComponentExperience';
import { SAMPLING_RATE_EMOJI_RENDERED_EXP } from '../../util/constants';
import { isMediaEmoji } from '../../util/is-media-emoji';
import { CachingMediaEmoji } from './CachingMediaEmoji';
import Emoji, { type Props as EmojiProps } from './Emoji';
import EmojiFallback from './EmojiFallback';
import { UfoErrorBoundary } from './UfoErrorBoundary';

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

const _default_1: React.MemoExoticComponent<
	(props: React.PropsWithChildren<CachingEmojiProps>) => React.JSX.Element
> = memo(CachingEmoji);

export default _default_1;
