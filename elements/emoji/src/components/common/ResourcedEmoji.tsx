import React, { useEffect } from 'react';

import { sampledUfoRenderedEmoji } from '../../util/analytics/sampledUfoRenderedEmoji';
import { ufoExperiences } from '../../util/analytics/ufoExperiences';
import { SAMPLING_RATE_EMOJI_RENDERED_EXP } from '../../util/constants';
import {
	ResourcedEmojiComponent,
	type Props as ResourcedEmojiProps,
} from './ResourcedEmojiComponent';
import { UfoErrorBoundary } from './UfoErrorBoundary';

export interface Props extends ResourcedEmojiProps {}

const ResourcedEmoji = (props: React.PropsWithChildren<Props>): React.JSX.Element => {
	const { emojiId, optimisticImageURL } = props;

	useEffect(() => {
		if (!emojiId) {
			return;
		}

		sampledUfoRenderedEmoji(emojiId).start({
			samplingRate: SAMPLING_RATE_EMOJI_RENDERED_EXP,
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
