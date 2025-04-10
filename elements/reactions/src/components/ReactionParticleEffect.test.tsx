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

	it('should add particle effect to the emoji', async () => {
		renderReactionParticleEffect();
		const emojis = await screen.findAllByText(`ResourcedEmoji`);
		expect(emojis.length).toBe(PARTICLE_COUNT);
	});
});
