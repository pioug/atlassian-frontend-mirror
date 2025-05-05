/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type EmojiProvider, ResourcedEmoji, type EmojiId } from '@atlaskit/emoji';
import { css, jsx } from '@compiled/react';

import { layers } from '@atlaskit/theme/constants';

import { RESOURCED_EMOJI_COMPACT_HEIGHT } from '../shared/constants';

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
	animation: 'reaction-particle-fade ease-in-out, reaction-particle-float ease',
	animationDuration: '700ms',

	// Override position and delay for each particle
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:nth-child(2)': {
		left: -5,
		animationDelay: '0.15s',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:nth-child(3)': {
		left: 8,
		animationDelay: '0.3s',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'&:nth-child(4)': {
		left: -1,
		animationDelay: '0.45s',
	},

	// NOTE: We're using this instead of `keyframes()` because this scenario is broken, refer to https://bitbucket.org/atlassian/atlassian-frontend-monorepo/pull-requests/148201
	/* eslint-disable @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors -- Using because distributed keyframes is broken */
	'@keyframes reaction-particle-fade': {
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
	},
	'@keyframes reaction-particle-float': {
		'0%': {
			transform: 'translateY(0) scale(1)',
		},
		'100%': {
			transform: 'translateY(-120px) scale(1.7)',
		},
	},
	/* eslint-enable @atlaskit/ui-styling-standard/no-unsafe-selectors, @atlaskit/ui-styling-standard/no-nested-selectors */
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
					<ResourcedEmoji
						emojiProvider={emojiProvider}
						emojiId={emojiId}
						fitToHeight={RESOURCED_EMOJI_COMPACT_HEIGHT}
					/>
				</div>
			);
		})}
	</div>
);
