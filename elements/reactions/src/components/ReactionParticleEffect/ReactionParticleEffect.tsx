/** @jsx jsx */
import { type EmojiProvider, ResourcedEmoji, type EmojiId } from '@atlaskit/emoji';
import { jsx } from '@emotion/react';

import { containerStyle, reactionParticleStyle } from './styles';

export const PARTICLE_COUNT = 4;

interface ReactionParticleEffectProps {
	/**
	 * ID of the emoji to show within the particle effect
	 */
	emojiId: EmojiId;
	/**
	 * Provider for loading emojis
	 */
	emojiProvider: Promise<EmojiProvider>;
}

export const ReactionParticleEffect = ({ emojiProvider, emojiId }: ReactionParticleEffectProps) => (
	// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
	<div css={containerStyle}>
		{[...Array(PARTICLE_COUNT)].map((_, index) => {
			return (
				// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
				<div key={index} css={reactionParticleStyle}>
					<ResourcedEmoji emojiProvider={emojiProvider} emojiId={emojiId} fitToHeight={16} />
				</div>
			);
		})}
	</div>
);
