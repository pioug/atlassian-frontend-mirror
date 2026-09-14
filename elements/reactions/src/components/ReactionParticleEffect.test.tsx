import React from 'react';
import { screen } from '@testing-library/react';
import { type EmojiDescription, type EmojiProvider } from '@atlaskit/emoji';
import { getTestEmojiRepository } from '@atlaskit/util-data-test/get-test-emoji-repository';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
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

	describe('a11y', () => {
		it('should set aria-hidden="true" on container', () => {
			const { container } = renderWithIntl(
				<ReactionParticleEffect
					emojiId={{ id: grinning.id, shortName: ' ' }}
					emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
				/>,
			);
			const particleContainer = container.querySelector('div') as HTMLElement;
			expect(particleContainer).toHaveAttribute('aria-hidden', 'true');
		});
	});
});
