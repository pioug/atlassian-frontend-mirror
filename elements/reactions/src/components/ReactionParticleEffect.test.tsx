import React from 'react';
import { screen } from '@testing-library/react';
import { type EmojiDescription, type EmojiProvider } from '@atlaskit/emoji';
import { getTestEmojiRepository } from '@atlaskit/util-data-test/get-test-emoji-repository';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { passGate, failGate } from '@atlassian/feature-flags-test-utils/mock-gates';
import {
	mockReactDomWarningGlobal,
	renderWithIntl,
	useFakeTimers,
} from '../__tests__/_testing-library';
import { PARTICLE_COUNT, ReactionParticleEffect } from './ReactionParticleEffect';

const emojiRepository = getTestEmojiRepository();
const grinning: EmojiDescription = emojiRepository.findByShortName(
	':grinning:',
) as EmojiDescription;

jest.mock('@atlaskit/emoji', () => {
	return {
		...jest.requireActual<typeof import('@atlaskit/emoji')>('@atlaskit/emoji'),
		ResourcedEmoji: () => <>ResourcedEmoji</>,
	};
});

const renderReactionParticleEffect = () =>
	renderWithIntl(
		<ReactionParticleEffect
			emojiId={{ id: grinning.id, shortName: ' ' }}
			emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
		/>,
	);

describe('@atlaskit/reactions/components/ReactionParticleEffect', () => {
	mockReactDomWarningGlobal();
	useFakeTimers();

	it('should add particle effect to the emoji', () => {
		renderReactionParticleEffect();
		const emojis = screen.getAllByText(`ResourcedEmoji`);
		expect(emojis.length).toBe(PARTICLE_COUNT);
	});

	it('should render PARTICLE_COUNT ResourcedEmoji instances when optimisticImageURL is provided', () => {
		renderWithIntl(
			<ReactionParticleEffect
				emojiId={{ id: grinning.id, shortName: ' ' }}
				emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
				optimisticImageURL="https://cdn.example.com/emoji/thumbsup.png"
			/>,
		);
		const emojis = screen.getAllByText(`ResourcedEmoji`);
		expect(emojis.length).toBe(PARTICLE_COUNT);
	});

	describe('a11y: platform_a11y_fixes_reaction_emoji gate', () => {
		it('should set aria-hidden="true" on container when gate is on', () => {
			passGate('platform_a11y_fixes_reaction_emoji');
			const { container } = renderWithIntl(
				<ReactionParticleEffect
					emojiId={{ id: grinning.id, shortName: ' ' }}
					emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
				/>,
			);
			const particleContainer = container.querySelector('div') as HTMLElement;
			expect(particleContainer).toHaveAttribute('aria-hidden', 'true');
		});

		it('should not set aria-hidden on container when gate is off', () => {
			failGate('platform_a11y_fixes_reaction_emoji');
			const { container } = renderWithIntl(
				<ReactionParticleEffect
					emojiId={{ id: grinning.id, shortName: ' ' }}
					emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
				/>,
			);
			const particleContainer = container.querySelector('div') as HTMLElement;
			expect(particleContainer).not.toHaveAttribute('aria-hidden');
		});
	});
});
