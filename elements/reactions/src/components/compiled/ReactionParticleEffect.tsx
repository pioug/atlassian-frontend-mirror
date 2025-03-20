/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type EmojiProvider, ResourcedEmoji, type EmojiId } from '@atlaskit/emoji';
import { css, jsx, keyframes } from '@compiled/react';

import { layers } from '@atlaskit/theme/constants';

const fade = keyframes({
	'0%': {
		opacity: 0,
	},
	'20%': {
		opacity: 1,
	},
	'60%': {
		opacity: 1,
	},
	'100%': {
		opacity: 0,
	},
});

const float = keyframes({
	'0%': {
		transform: 'translateY(0) scale(1)',
	},
	'100%': {
		transform: 'translateY(-120px) scale(1.7)',
	},
});

const containerStyle = css({
	position: 'relative',
	left: 8,

	// Ensure the effect displays above tooltips
	zIndex: layers.tooltip() + 1,

	'@media (prefers-reduced-motion: reduce)': {
		opacity: 0,
	},
});

const reactionParticleStyle = css({
	position: 'absolute',
	top: 0,
	left: 0,
	pointerEvents: 'none',
	opacity: 0,
	animation: `${fade} ease-in-out, ${float} ease`,
	animationDuration: '700ms',

	// Override position and delay for each particle
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':nth-child(2)': {
		left: -5,
		animationDelay: '0.15s',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':nth-child(3)': {
		left: 8,
		animationDelay: '0.3s',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	':nth-child(4)': {
		left: -1,
		animationDelay: '0.45s',
	},
});

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
	<div css={containerStyle}>
		{[...Array(PARTICLE_COUNT)].map((_, index) => {
			return (
				<div key={index} css={reactionParticleStyle}>
					<ResourcedEmoji emojiProvider={emojiProvider} emojiId={emojiId} fitToHeight={16} />
				</div>
			);
		})}
	</div>
);
