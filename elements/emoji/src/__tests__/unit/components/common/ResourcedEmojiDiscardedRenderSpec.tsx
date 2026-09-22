import React, { Suspense } from 'react';

import { screen, waitFor } from '@testing-library/react';

import type { EmojiProvider } from '../../../../api/EmojiResource';
import ResourcedEmoji from '../../../../components/common/ResourcedEmoji';
import { grinEmoji } from '../../_test-data';
import { renderWithIntl } from '../../_testing-library';

const neverResolves = new Promise<never>(() => {});

const SuspendWhen = ({ suspend }: { suspend: boolean }): null => {
	if (suspend) {
		throw neverResolves;
	}
	return null;
};

// Everything in the provider chain resolves on microtasks, so yielding one macrotask drains it.
const settle = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

/**
 * Mounts an emoji, then re-renders its parent in a pass that suspends. React discards that pass,
 * so nothing from it should reach the emoji provider.
 */
const mountThenDiscardARender = async () => {
	const fetchByEmojiId = jest.fn(() => Promise.resolve(grinEmoji));
	const emojiProvider = Promise.resolve({ fetchByEmojiId } as unknown as EmojiProvider);
	const Page = ({ suspend }: { suspend: boolean }) => (
		<Suspense fallback={<span>suspended</span>}>
			<ResourcedEmoji
				emojiProvider={emojiProvider}
				emojiId={{ id: grinEmoji.id, shortName: grinEmoji.shortName }}
			/>
			<SuspendWhen suspend={suspend} />
		</Suspense>
	);

	const { rerender } = renderWithIntl(<Page suspend={false} />);
	await waitFor(() => expect(fetchByEmojiId).toHaveBeenCalledTimes(1));

	rerender(<Page suspend />);
	expect(screen.getByText('suspended')).toBeInTheDocument();

	return fetchByEmojiId;
};

describe('<ResourcedEmoji /> in a render that never commits', () => {
	it('does not fetch from a discarded render', async () => {
		const fetchByEmojiId = await mountThenDiscardARender();
		expect(fetchByEmojiId).toHaveBeenCalledTimes(1);

		await settle();
		expect(fetchByEmojiId).toHaveBeenCalledTimes(1);
	});
});
