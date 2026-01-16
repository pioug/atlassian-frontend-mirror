import React, { useMemo } from 'react';

import { Status } from '@atlaskit/avatar';
import { cssMap } from '@atlaskit/css';
import { type EmojiProvider, ResourcedEmoji } from '@atlaskit/emoji';
import { Box } from '@atlaskit/primitives/compiled';
import { token } from '@atlaskit/tokens';

export const getTownsquareEmojiProvider = async (): Promise<EmojiProvider> => {
	const mod = await import(
		/* webpackChunkName: "async-townsquare-emoji-provider" */
		'./provider'
	);
	return mod.emojiProvider;
};

const styles = cssMap({
	container: {
		position: 'relative',
	},
	emoji: {
		position: 'absolute',
		bottom: token('space.negative.025'),
		right: token('space.negative.050'),
		pointerEvents: 'none',
		height: '11px',
		width: '11px',
	},
});

export type Props = {
	emoji: string;
	isPrivate?: boolean | null;
	height?: number;
};

export const ProjectIcon = ({ emoji, isPrivate, height }: Props) => {
	const emojiProvider = useMemo<Promise<EmojiProvider> | undefined>(() => {
		if (!emoji) {
			return undefined;
		}
		return getTownsquareEmojiProvider();
	}, [emoji]);

	const emojiId = useMemo(
		() => (emoji ? { shortName: emoji } : undefined),
		[emoji],
	);
	if (!emojiProvider || !emojiId) {
		return null;
	}

	return (
		<Box xcss={styles.container}>
			<ResourcedEmoji emojiId={emojiId} emojiProvider={emojiProvider} fitToHeight={height ?? 16} />
			{isPrivate && (
				<Box xcss={styles.emoji}>
					<Status status="locked" />
				</Box>
			)}
		</Box>
	);
};
