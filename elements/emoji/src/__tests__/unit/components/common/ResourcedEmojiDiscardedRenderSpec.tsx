import React, { Suspense } from 'react';
import { screen, waitFor } from '@testing-library/react';

import { mockExpDisabled } from '@atlassian/experiment-test-utils/mock-exp-disabled';
import { mockExpEnabled } from '@atlassian/experiment-test-utils/mock-exp-enabled';
import { resetAllExperiments } from '@atlassian/experiment-test-utils/reset-all-experiments';

import type { EmojiProvider } from '../../../../api/EmojiResource';
import ResourcedEmoji from '../../../../components/common/ResourcedEmoji';
import { grinEmoji } from '../../_test-data';
import { renderWithIntl } from '../../_testing-library';

const EXPERIMENT = 'platform_emoji_fetch_in_effect';

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
	afterEach(() => {
		resetAllExperiments();
	});

	it('does not fetch from a discarded render when platform_emoji_fetch_in_effect is enabled', async () => {
		mockExpEnabled(EXPERIMENT);

		const fetchByEmojiId = await mountThenDiscardARender();
		expect(fetchByEmojiId).toHaveBeenCalledTimes(1);

		await settle();
		expect(fetchByEmojiId).toHaveBeenCalledTimes(1);
	});

	it('fetches from a discarded render when platform_emoji_fetch_in_effect is disabled', async () => {
		mockExpDisabled(EXPERIMENT);

		const fetchByEmojiId = await mountThenDiscardARender();

		// Asserted without settling: each fetch from a discarded render sets state from its promise,
		// which schedules another render that suspends again, so draining microtasks here would loop
		// until the test times out. That loop is the behaviour the experiment removes.
		expect(fetchByEmojiId).toHaveBeenCalledTimes(2);
	});
});
