import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { IntlProvider } from 'react-intl-next';

import { type EmojiProvider } from '@atlaskit/emoji';
import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import {
	ReactionSummaryButton,
	RENDER_SUMMARY_BUTTON_TESTID,
	RENDER_SUMMARY_EMOJI_TESTID,
} from './ReactionSummaryButton';
import { DefaultReactions } from '../shared/constants';
import { getReactionSummary } from '../MockReactionsClient';
import { messages } from '../shared/i18n';
import { type ReactionSummary } from '../types';
import { RENDER_COUNTER_TESTID } from './Counter';

jest.mock('./ReactionParticleEffect', () => {
	return {
		ReactionParticleEffect: () => <>ReactionParticleEffect</>,
	};
});

/**
 * Pre defined selected emoji ids
 */
const reactions: ReactionSummary[] = [
	getReactionSummary(DefaultReactions[0].shortName, 5, false),
	getReactionSummary(DefaultReactions[1].shortName, 4, true),
	getReactionSummary(DefaultReactions[2].shortName, 3, false),
	getReactionSummary(DefaultReactions[3].shortName, 10, true),
];

const mockOnClick = jest.fn();

describe('ReactionSummaryButton', () => {
	const renderComponent = (extraProps = {}) =>
		render(
			<IntlProvider locale="en">
				<ReactionSummaryButton
					emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
					reactions={reactions}
					onClick={mockOnClick}
					{...extraProps}
				/>
			</IntlProvider>,
		);

	it('renders the top N emojis based on the prop `emojisToShow`', () => {
		renderComponent({ emojisToShow: 4 });

		// this is the main summary button
		const summaryButton = screen.getByTestId(RENDER_SUMMARY_BUTTON_TESTID);
		expect(summaryButton).toBeInTheDocument();

		const { getAllByTestId } = within(summaryButton);
		const emoji = getAllByTestId(RENDER_SUMMARY_EMOJI_TESTID);

		// 4 emojis should display inside of the button since we changed the emojis to show prop to 4
		expect(emoji).toHaveLength(4);
	});

	it('renders top 3 emojis by default', () => {
		renderComponent();

		// this is the main summary button
		const summaryButton = screen.getByTestId(RENDER_SUMMARY_BUTTON_TESTID);
		expect(summaryButton).toBeInTheDocument();

		// 3 emojis should display inside of the button by default
		const { getAllByTestId } = within(summaryButton);
		const emoji = getAllByTestId(RENDER_SUMMARY_EMOJI_TESTID);
		expect(emoji).toHaveLength(3);
	});

	it('renders reactions in descending order by count', () => {
		renderComponent({ emojisToShow: 4 });

		const emojiDivs = screen.getAllByTestId('summary-emoji-display');

		// Get all emoji-ids. They'll be used to verify the correct sorting order
		const renderedEmojiIds = emojiDivs
			.map((div) => {
				const emojiSpan = div.querySelector('span[data-emoji-id]');
				return emojiSpan ? emojiSpan.getAttribute('data-emoji-id') : null;
			})
			.filter((id) => id !== null);

		const expectedEmojiIdsOrder = [...reactions]
			.sort((a, b) => b.count - a.count)
			.map((reaction) => reaction.emojiId);

		// Verify the rendered order of emoji IDs matches the expected order
		renderedEmojiIds.forEach((id, index) => {
			expect(id).toBe(expectedEmojiIdsOrder[index]);
		});
	});

	it('should display the total reaction count', async () => {
		renderComponent();
		const counter = screen.getByText('22');
		expect(counter).toBeInTheDocument();
	});

	it('should display the summary button icon after when summaryButtonIconAfter is passed in', async () => {
		renderComponent({ summaryButtonIconAfter: <div>Summary Button Icon After</div> });
		const summaryButtonIconAfter = screen.getByText('Summary Button Icon After');
		expect(summaryButtonIconAfter).toBeInTheDocument();
	});

	it('should call onClick callback when clicked', async () => {
		renderComponent();
		const button = screen.getByTestId(RENDER_SUMMARY_BUTTON_TESTID);
		fireEvent.click(button);
		expect(mockOnClick).toHaveBeenCalled();
	});

	it('should have an accessible label', () => {
		renderComponent();
		const button = screen.getByRole('button');
		expect(button).toHaveAccessibleName(messages.summary.defaultMessage);
	});

	it('should accurately count reactions without being affected by non number values', async () => {
		const mockReactions: ReactionSummary[] = [
			{
				emojiId: '1',
				count: 5,
				ari: 'mock-ari-1',
				containerAri: 'mock-container-ari-1',
				reacted: false,
			},
			{
				emojiId: '2',
				count: NaN, // Making sure something like this doesn't break the counter
				ari: 'mock-ari-2',
				containerAri: 'mock-container-ari-2',
				reacted: false,
			},
			{
				emojiId: '3',
				count: 10,
				ari: 'mock-ari-3',
				containerAri: 'mock-container-ari-3',
				reacted: false,
			},
		];
		render(
			<IntlProvider locale="en">
				<ReactionSummaryButton
					emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
					reactions={mockReactions}
					onClick={() => {}}
				/>
			</IntlProvider>,
		);

		const counter = await screen.findByTestId(RENDER_COUNTER_TESTID);
		expect(counter).toHaveTextContent('15');
	});

	it('should have an opaque background if showOpaqueBackground is true', () => {
		renderComponent({ showOpaqueBackground: true });
		const button = screen.getByRole('button');
		expect(button).toHaveCompiledCss('background-color', 'var(--ds-surface,#fff)');
	});

	it('should render summary button with height of 24px', async () => {
		renderComponent();
		const summaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);
		expect(summaryButton).toHaveCompiledCss('height', '24px');
	});

	it('should render the particle effect when summaryViewParticleEffectEmojiId is passed in', async () => {
		renderComponent({ summaryViewParticleEffectEmojiId: { id: '1f44f', shortName: '1f44f' } });
		const particleEffect = await screen.findByText('ReactionParticleEffect');
		expect(particleEffect).toBeInTheDocument();
	});

	it('should not render the particle effect when summaryViewParticleEffectEmojiId is not passed in', async () => {
		renderComponent();
		await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);
		expect(screen.queryByText('ReactionParticleEffect')).not.toBeInTheDocument();
	});
});
