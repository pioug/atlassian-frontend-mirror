import React, { useEffect } from 'react';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	ResourcedEmojiComponent,
	type Props as ResourcedEmojiProps,
} from './ResourcedEmojiComponent';
import { UfoErrorBoundary } from './UfoErrorBoundary';
import { sampledUfoRenderedEmoji, ufoExperiences } from '../../util/analytics';
import { SAMPLING_RATE_EMOJI_RENDERED_EXP } from '../../util/constants';

export interface Props extends ResourcedEmojiProps {}

const ResourcedEmoji = (props: React.PropsWithChildren<Props>) => {
	const { emojiId, optimisticImageURL } = props;

	useEffect(() => {
		if (!emojiId) {
			return;
		}

		var shouldAlwaysSample: boolean = fg('platform_always_sample_rendered_emoji');
		sampledUfoRenderedEmoji(emojiId).start({
			samplingRate: shouldAlwaysSample ? 1 : SAMPLING_RATE_EMOJI_RENDERED_EXP,
		});
		ufoExperiences['emoji-rendered'].getInstance(emojiId.id || emojiId.shortName).addMetadata({
			source: 'ResourcedEmoji',
			emojiId: emojiId.id,
			isOptimisticImageURL: !!optimisticImageURL,
		});
		return () => {
			sampledUfoRenderedEmoji(emojiId).abort({
				metadata: {
					source: 'ResourcedEmoji',
					reason: 'unmount',
				},
			});
		};
	}, [emojiId, optimisticImageURL]);

	return (
		<UfoErrorBoundary
			experiences={[
				ufoExperiences['emoji-rendered'].getInstance(props.emojiId.id || props.emojiId.shortName),
			]}
		>
			<ResourcedEmojiComponent {...props} />
		</UfoErrorBoundary>
	);
};

export default ResourcedEmoji;
