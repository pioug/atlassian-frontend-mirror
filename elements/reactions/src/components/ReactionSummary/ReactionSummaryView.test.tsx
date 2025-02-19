import React from 'react';
import { fireEvent, render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from 'react-intl-next';

import { getTestEmojiResource } from '@atlaskit/util-data-test/get-test-emoji-resource';
import { getReactionSummary } from '../../MockReactionsClient';
import { DefaultReactions } from '../../shared/constants';
import { type ReactionSummary } from '../../types';
import { RENDER_SUMMARY_VIEW_POPUP_TESTID, ReactionSummaryView } from './ReactionSummaryView';
import { type EmojiProvider } from '@atlaskit/emoji';
import { RENDER_SUMMARY_BUTTON_TESTID } from './ReactionSummaryButton';
import { RENDER_REACTION_TESTID } from '../Reaction/Reaction';

const reactions: ReactionSummary[] = [
	getReactionSummary(DefaultReactions[0].shortName, 5, false),
	getReactionSummary(DefaultReactions[1].shortName, 4, true),
	getReactionSummary(DefaultReactions[2].shortName, 3, false),
	getReactionSummary(DefaultReactions[3].shortName, 10, true),
];

describe('ReactionSummaryView', () => {
	const renderComponent = (extraProps = {}) =>
		render(
			<IntlProvider locale="en">
				<ReactionSummaryView
					emojiProvider={getTestEmojiResource() as Promise<EmojiProvider>}
					reactions={reactions}
					onReactionClick={jest.fn()}
					{...extraProps}
				/>
			</IntlProvider>,
		);

	it('should popup the list of reactions when the summary button is clicked', async () => {
		renderComponent();
		const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);
		act(() => {
			// click the summary button which opens it to see all the reactions
			fireEvent.click(reactionSummaryButton);
		});

		const summaryViewPopup = await screen.findByTestId(RENDER_SUMMARY_VIEW_POPUP_TESTID);
		expect(summaryViewPopup).toBeInTheDocument();
	});

	it('should open detailed reactions view on summary click', async () => {
		const onReactionClickMock = jest.fn();
		renderComponent({
			onReactionClick: onReactionClickMock,
		});
		const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);

		act(() => {
			// click the summary button which opens it to see all the reactions
			fireEvent.click(reactionSummaryButton);
		});
		// make sure the correct number of reactions show
		const reactionButtons = await screen.findAllByTestId(RENDER_REACTION_TESTID);
		expect(reactionButtons.length).toEqual(reactions.length);
		fireEvent.click(reactionButtons[0]);
		expect(onReactionClickMock).toHaveBeenCalled();
	});

	it('should handle mouse enter and focus events on reactions', async () => {
		const onReactionMouseEnterMock = jest.fn();
		const onReactionFocusedMock = jest.fn();
		renderComponent({
			onReactionMouseEnter: onReactionMouseEnterMock,
			onReactionFocused: onReactionFocusedMock,
		});

		const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);
		await act(async () => {
			fireEvent.click(reactionSummaryButton);
		});
		const reactionButtons = await screen.findAllByTestId(RENDER_REACTION_TESTID);
		expect(reactionButtons.length).toEqual(reactions.length);

		await act(async () => {
			fireEvent.mouseEnter(reactionButtons[0]);
		});

		expect(onReactionMouseEnterMock).toHaveBeenCalled();

		await act(async () => {
			fireEvent.focus(reactionButtons[0]);
		});
		expect(onReactionFocusedMock).toHaveBeenCalled();
	});

	it('should render Reactions Dialog entrypoint and invoke dialog open if user dialog is allowed', async () => {
		const mockHandleOpenReactionsDialog = jest.fn();
		renderComponent({
			reactions,
			allowUserDialog: true,
			handleOpenReactionsDialog: mockHandleOpenReactionsDialog,
		});

		const reactionSummaryButton = await screen.findByTestId(RENDER_SUMMARY_BUTTON_TESTID);
		await userEvent.click(reactionSummaryButton);

		const reactionButtons = await screen.findAllByTestId(RENDER_REACTION_TESTID);
		expect(reactionButtons.length).toEqual(reactions.length);
		await userEvent.hover(reactionButtons[3]);

		const labelRegex = /and \d+ others/i;
		const dialogEntrypoints = await screen.findAllByText(labelRegex);
		expect(dialogEntrypoints.length).toBeGreaterThan(0);
		await userEvent.click(dialogEntrypoints[0]);

		expect(mockHandleOpenReactionsDialog).toHaveBeenCalled();
	});
});
